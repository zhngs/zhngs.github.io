---
date: '2022-06-01'
---
# 一.函数定义

rust函数使用关键字 `fn`来定义，函数名风格使用snake case，所有字母都是小写并使用下划线分隔单词

```rust
fn main() {
    let x = plus_one(5);
    println!("The value of x is: {}", x);
}

fn plus_one(x: i32) -> i32 {
    x + 1
}
```

函数名后跟形参列表，如果有返回值的话，可以在箭头后声明类型，`函数的返回值等同于函数体最后一个表达式的值，如果不写返回值的话，默认返回单元类型()`

# 二.闭包

## 1.语法

一个简单的闭包例子如下，调用闭包是 `add_one_v3` 和 `add_one_v4` 能够编译的必要条件，因为需要推断类型

```rust
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;
```

闭包可以通过三种方式捕获其环境，它们直接对应到函数获取参数的三种方式：不可变借用，可变借用和获取所有权。闭包会根据函数体中如何使用被捕获的值决定用哪种方式捕获

```rust
// 注意在 borrows_mutably 闭包的定义和调用之间不再有 println!，当 borrows_mutably 定义时，它捕获了 list 的可变引用
fn main() {
    let mut list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);

    let mut borrows_mutably = || list.push(7);

    borrows_mutably();
    println!("After calling closure: {:?}", list);
}
```

可以使用move关键字强制捕获所有权

```rust
fn main() {
    let list = vec![1, 2, 3];
    println!("Before defining closure: {:?}", list);

    thread::spawn(move || println!("From thread: {:?}", list))
        .join()
        .unwrap();
}
```

## 2.相关trait

闭包捕获和处理环境中的值的方式影响闭包实现的 trait。Trait 是函数和结构体指定它们能用的闭包的类型的方式。取决于闭包体如何处理值，闭包自动、渐进地实现一个、两个或三个 `Fn` trait

- `FnOnce` 适用于能被调用一次的闭包，所有闭包都至少实现了这个 trait，因为所有闭包都能被调用。一个会将捕获的值移出闭包体的闭包只实现 `FnOnce` trait，这是因为它只能被调用一次
- `FnMut` 适用于不会将捕获的值移出闭包体的闭包，但它可能会修改被捕获的值。这类闭包可以被调用多次
- `Fn` 适用于既不将被捕获的值移出闭包体也不修改被捕获的值的闭包，当然也包括不从环境中捕获值的闭包。这类闭包可以被调用多次而不改变它们的环境，这在会多次并发调用闭包的场景中十分重要

标准库中的一个例子如下，使用了FnOnce

```rust
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}
```

下面是一个只实现FnOnce的例子，该闭包将捕获的值移出了闭包

```rust
fn main() {
    let mut list = [
        Rectangle { width: 10, height: 1 },
        Rectangle { width: 3, height: 5 },
        Rectangle { width: 7, height: 12 },
    ];

    let mut sort_operations = vec![];
    let value = String::from("by key called");

    list.sort_by_key(|r| {
        sort_operations.push(value); // 把value移动到了sort_operations，所以该闭包只能调用一次
        r.width
    });
    println!("{:#?}", list);
}
```

# 三.迭代器

**迭代器** （ *iterator* ）负责遍历序列中的每一项和决定序列何时结束的逻辑，迭代器和闭包都属于函数式编程的技术

以下是一个使用迭代器的简单例子

```rust
let v1 = vec![1, 2, 3];

let v1_iter = v1.iter();

for val in v1_iter {
    println!("Got: {}", val);
}
```

## 1.Iterator trait

迭代器都实现了一个叫做 `Iterator` 的定义于标准库的 trait

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // 此处省略了方法的默认实现
}
```

## 2.消费迭代器

注意 `v1_iter` 需要是可变的：在迭代器上调用 `next` 方法改变了迭代器中用来记录序列位置的状态

另外需要注意到从 `next` 调用中得到的值是 vector 的不可变引用

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_demonstration() {
        let v1 = vec![1, 2, 3];

        let mut v1_iter = v1.iter();

        assert_eq!(v1_iter.next(), Some(&1));
        assert_eq!(v1_iter.next(), Some(&2));
        assert_eq!(v1_iter.next(), Some(&3));
        assert_eq!(v1_iter.next(), None);
    }
}

```

`Iterator` trait 有一系列不同的由标准库提供默认实现的方法，一些方法在其定义中调用了 `next` 方法，这些调用 `next` 方法的方法被称为  **消费适配器** （ *consuming adaptors* ）

```rust
    fn iterator_sum() {
        let v1 = vec![1, 2, 3];

        let v1_iter = v1.iter();

        let total: i32 = v1_iter.sum(); // sum就是消费适配器

        assert_eq!(total, 6);
    }
```

## 3.产生其他迭代器

`Iterator` trait 中定义了另一类方法，被称为  **迭代器适配器** （ *iterator adaptors* ），它们允许我们将当前迭代器变为不同类型的迭代器

不过因为所有的迭代器都是惰性的，必须调用一个消费适配器方法以便获取迭代器适配器调用的结果

```rust
    let v1: Vec<i32> = vec![1, 2, 3];

    // map是迭代器适配器 collect是消费迭代器
    let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();

    assert_eq!(v2, vec![2, 3, 4]);
```

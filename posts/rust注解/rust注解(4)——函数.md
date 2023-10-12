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

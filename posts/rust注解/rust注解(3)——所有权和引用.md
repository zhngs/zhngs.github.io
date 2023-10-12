---
date: '2022-05-31'
---
# 一.所有权

rust的所有权主要目的是用来管理堆数据的，可以理解为c++的unique_ptr，核心思想是移动语义和RAII（本质是把变量的生命周期和资源的生命周期绑定），所有权规则如下：

- Rust 中的每一个值都有一个被称为其 **所有者**（*owner*）的变量
- 值在任一时刻有且只有一个所有者
- 当所有者（变量）离开作用域，这个值将被丢弃

## 1.数据和变量交互方式

rust中数据和变量的交互方式有2种，`移动`和 `克隆`，可以类比于c++类中的拷贝函数和移动函数

### 1.1 移动

下述例子可以防止double free，值在任一时刻有且只有一个所有者，自然不会发生double free

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    println!("{}, world!", s1);
}
```

### 1.2 克隆

想要深拷贝堆上的数据，可以使用 `clone`函数，原因是String实现了 `Clone` trait，`Clone` trait可以明确地创建一个值的深拷贝（deep copy）

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1 = {}, s2 = {}", s1, s2);
}
```

note：Rust 有一个叫做 `Copy` trait 的特殊注解，可以用在类似整型这样的存储在栈上的类型，一个实现了 `Copy` trait 的类型必须也实现了 `Clone` trait，如果一个类型实现了 `Copy` trait，那么一个旧的变量在将其赋值给其他变量后仍然可以使用。考虑如下情况，因为整型实现了 `Copy` trait，所以不会报错

```rust
fn main() {
    let x = 5;
    let y = x;
    println!("x = {}, y = {}", x, y); //不会报错
}
```

实现 `Copy` trait的类型如下：

- 所有整数类型，比如 `u32`
- 布尔类型，`bool`，它的值是 `true` 和 `false`
- 所有浮点数类型，比如 `f64`
- 字符类型，`char`
- 元组，当且仅当其包含的类型也都实现 `Copy` 的时候。比如，`(i32, i32)` 实现了 `Copy`，但 `(i32, String)` 就没有

# 二.引用

不用获取所有权就可以使用值的功能，叫做 **引用**（*references*）,引用本质是一个指针，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据

## 1.不可变引用

下述代码会报错，因为 `&T`形式是不可变引用的类型

```rust
fn main() {
    let s = String::from("hello");
    change(&s);
}

fn change(some_string: &String) {
    some_string.push_str(", world"); // 报错
}
```

## 2.可变引用

只需要加上 `mut`关键字，就可以使用可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}
fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

## 3.引用规则

引用必须遵守如下规则：

- 在任意给定时间，**要么** 只能有一个可变引用，**要么** 只能有多个不可变引用。
- 引用必须总是有效的。

### 3.1 数据竞争

**数据竞争**（*data race*）是一个老生常谈的问题，根本原因在于 `同时读写数据但没有同步机制`，rust中的引用可以避免数据竞争，因为它遵守如下规则：

- `在任意给定时间，要么只能有一个可变引用，要么只能有多个不可变引用`

如下代码违反了规则，无法通过编译

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    let r3 = &mut s; // 大问题
    println!("{}, {}, and {}", r1, r2, r3);
}
```

note：`一个引用的作用域从声明的地方开始一直持续到最后一次使用为止`，如下代码可以通过编译

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s; // 没问题
    let r2 = &s; // 没问题
    println!("{} and {}", r1, r2);
    // 此位置之后 r1 和 r2 不再使用
    let r3 = &mut s; // 没问题
    println!("{}", r3);
}
```

### 3.2 悬垂引用

`引用必须总是有效的`，如下代码无法通过编译，原因是rust不带垃圾回收（gc），对于像go这种带gc的语言，变量是能够逃逸的

```rust
fn dangle() -> &String { // dangle 返回一个字符串的引用
    let s = String::from("hello"); // s 是一个新字符串
    &s // 返回字符串 s 的引用
} // 这里 s 离开作用域并被丢弃。其内存被释放。
```

正确用法如下

```rust
fn no_dangle() -> String {
    let s = String::from("hello");
    s
}
```

# 三.生命周期

rust引入生命周期解决的问题是 `在编译期确定所有引用有效`，引用也是变量，和被引用的变量都有生命周期，需要保证被引用变量的生命周期比引用的生命周期长

```rust
&i32        // 引用
&'a i32     // 带有显式生命周期的引用
&'a mut i32 // 带有显式生命周期的可变引用
```

## 1.函数生命周期

生命周期语法是用于将函数的多个参数与其返回值的生命周期进行关联的。一旦它们形成了某种关联，Rust 就有了足够的信息来允许内存安全的操作并阻止会产生悬垂指针亦或是违反内存安全的行为

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## 2.结构体生命周期

以下例子意味着 ImportantExcerpt 的实例不能比其 part 字段中的引用存在的更久

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```

## 3.生命周期省略

被编码进 Rust 引用分析的模式被称为 生命周期省略规则（lifetime elision rules）

函数或方法的参数的生命周期被称为 输入生命周期（input lifetimes），而返回值的生命周期被称为 输出生命周期（output lifetimes）。编译器采用三条规则来判断引用何时不需要明确的注解。第一条规则适用于输入生命周期，后两条规则适用于输出生命周期

- 第一条规则是编译器为每一个引用参数都分配一个生命周期参数。函数有一个引用参数的就有一个生命周期参数：`fn foo<'a>(x: &'a i32)`，有两个引用参数的函数就有两个不同的生命周期参数，`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`，依此类推
- 第二条规则是如果只有一个输入生命周期参数，那么它被赋予所有输出生命周期参数: `fn foo<'a>(x: &'a i32) -> &'a i32`
- 第三条规则是如果方法有多个输入生命周期参数并且其中一个参数是 &self 或 &mut self，说明是个对象的方法 (method)，那么所有输出生命周期参数被赋予 self 的生命周期

```rust
// 以该函数为例
fn longest(x: &str, y: &str) -> &str

// 假设我们自己就是编译器并应用第一条规则：每个引用参数都有其自己的生命周期。这次有两个参数，所以就有两个（不同的）生命周期：
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str {

// 再来应用第二条规则，因为函数存在多个输入生命周期，它并不适用于这种情况

// 再来看第三条规则，它同样也不适用，这是因为没有 self 参数

// 代码时会出现错误的原因：编译器使用所有已知的生命周期省略规则，仍不能计算出签名中所有引用的生命周期
```

## 4.方法中的生命周期

结构体字段的生命周期必须总是在 `impl` 关键字之后声明并在结构体名称之后被使用，因为这些生命周期是结构体类型的一部分

```rust
// 这里有两个输入生命周期，所以 Rust 应用第一条生命周期省略规则并给予 &self 和 announcement 它们各自的生命周期
// 接着，因为其中一个参数是 &self，返回值类型被赋予了 &self 的生命周期，这样所有的生命周期都被计算出来了
impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}
```

## 5.静态生命周期

静态生命周期`'static`，其生命周期能够存活于整个程序期间
```rust
// 所有的字符串字面值都拥有 'static 生命周期，我们也可以选择像下面这样标注出来
let s: &'static str = "I have a static lifetime.";
```

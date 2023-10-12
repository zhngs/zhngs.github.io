---
date: '2022-10-11'
---
# 一.封装和继承
rust使用struct和method来实现封装，rust不支持继承

# 二.多态

## 1.编译时多态
以下全是在编译时确定类型的多态
### 1.1 泛型
以下是函数泛型，在调用时不需要指定T的类型，rust会自动推导
```rust
fn largest<T>(list: &[T]) -> &T {
    let mut largest = &list[0];

    for item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);
}
```

以下是结构体泛型，方法也可以使用泛型
```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

以下是枚举中的泛型
```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### 1.2 trait简介

trait类似于其他语言中的接口，以下是一个使用示例

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

trait可以定义默认方法，如果想要对 `NewsArticle` 实例使用这个默认实现，可以通过 `impl Summary for NewsArticle {}` 指定一个空的 `impl` 块

```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

impl Summary for NewsArticle {
}
```

### 1.3 trait作为参数

trait的类型可以看作是 `impl T`，但是这里本质是个泛型

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

trait作为参数有另一种写法 `trait bound`，本质是泛型（直觉上和c++的模板特化很像）

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

trait bound会限制参数的实际类型

```rust
// 泛型 T 被指定为 item1 和 item2 的参数限制，如此传递给参数 item1 和 item2 值的具体类型必须一致
pub fn notify<T: Summary>(item1: &T, item2: &T)

// item1 和 item2 允许是不同类型的情况（只要它们都实现了 Summary）
pub fn notify(item1: &impl Summary, item2: &impl Summary)
```

可以通过 `+` 来指定多个trait bound

```rust
pub fn notify(item: &(impl Summary + Display))

pub fn notify<T: Summary + Display>(item: &T)
```

为了更具有可读性，trait bound可以使用where，函数签名显得不那么杂乱，函数名、参数列表和返回值类型都离得很近

```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {


fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
```

### 1.4 使用trait bound有条件地实现方法
如下是一个例子，只有那些为 T 类型实现了 PartialOrd trait（来允许比较） 和 Display trait（来启用打印）的 Pair<T> 才会实现 cmp_display 方法
```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

另外一种特殊的用法是blanket implementations，广泛的用于 Rust 标准库中。例如，标准库为任何实现了 Display trait 的类型实现了 ToString trait
```rust
impl<T: Display> ToString for T {
    // --snip--
}
```

### 1.5 trait作为返回值

以下是一个简单的例子，但是只能返回一种特定的实现Summary的类型，之所以只能返回一种特定的实现，还是因为这里的Summary本质是个泛型，编译时就要确定其具体类型，并且在c++中函数的返回值不会参与函数重载的判断（想想调用两个只有返回值不同的函数，如何确定调用的是哪个函数？）

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
        reply: false,
        retweet: false,
    }
}
```

## 2.运行时多态
rust通过在trait类型前加`dyn`关键字可以实现运行时多态（实现原理类似c++的虚函数表），需要关注的一个细节是使用dyn的trait时，必须是指针指向该trait，以下示例是使用了Box，这里的本质原因是`dync trait在编译时不知道其具体大小，所以只能通过指针指向`
```rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}
```
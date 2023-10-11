---
date: '2022-10-11'
---
# 一.trait简介

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

# 二.trait作为参数

trait的类型可以看作是 `impl T`

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

trait作为参数有一个语法糖 `trait bound`，可以看作泛型的一种特殊用法（直觉上和c++的模板特化很像）

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

# 三.使用trait bound有条件地实现方法
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

# 四.trait作为返回值

以下是一个简单的例子，但是只能返回一种特定的实现Summary的类型

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

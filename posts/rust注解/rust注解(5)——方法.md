---
date: '2022-06-02'
---

# 一.结构体

## 1.结构体字面量

初始化结构体一般使用结构体字面量的方法

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
}
```

有一种**字段初始化简写语法**（*field init shorthand*），因为 `email` 字段与 `email` 参数有着相同的名称，则只需编写 `email` 而不是 `email: email`，`username`同理

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

使用旧实例的大部分值但改变其部分值来创建一个新的结构体可以通过 **结构体更新语法**（*struct update syntax*），`..` 语法指定了剩余未显式设置值的字段应有与给定实例对应字段相同的值

```rust
fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

# 二.方法

## 1.方法定义

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

- 方法定义在`impl`块中，想要实现某个结构体的方法，就在`impl`后跟上结构体的名字，每个结构体都允许拥有多个 `impl` 块

- 方法与函数类似，使用 `fn` 关键字和名称声明，可以拥有参数和返回值，但第一个参数总是 `self`，它代表调用该方法的结构体实例

- 在 `area` 的签名中，使用 `&self` 来替代 `rectangle: &Rectangle`，`&self` 实际上是 `self: &Self` 的缩写，在一个 impl块中，`Self` 类型是impl块的类型的别名

- 结构体使用方法时，直接使用点号后跟方法名即可

## 2.自动引用和解引用

当使用 `object.something()` 调用方法时，Rust 会自动为 `object` 添加 `&`、`&mut` 或 `*` 以便使 `object` 与方法签名匹配，下述代码是等价的

```rust
rect1.area();
(&rect1).area();
```

这种自动引用的行为之所以有效，是因为方法有一个明确的接收者———— `self` 的类型，在给出接收者和方法名的前提下，Rust 可以明确地计算出方法是仅仅读取（`&self`），做出修改（`&mut self`）或者是获取所有权（`self`）

## 3.特殊的关联函数

所有在 `impl` 块中定义的函数被称为 **关联函数**（*associated functions*），我们可以定义不以 `self` 为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例，实际上这类似于c++的静态方法。`不是方法的关联函数经常被用作返回一个结构体新实例的构造函数`

```rust
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}
```

使用结构体名和 `::` 语法来调用这个关联函数：比如 `let sq = Rectangle::square(3);`

---
date: '2022-05-28'
---
# 一.变量

rust使用 `let`关键字声明变量，语法为 `let name: type = expression`，其中type和expression可以省略

- 如果省略type，则type会由expression推导出来
- 如果省略expression，`初始值必定在声明语句下方的某一个位置，如果rust变量没有被赋值而使用，则会报错`

```rust
let x: i32 = 5;
let y;
y = 6;
```

rust中变量默认是不可变的，即不能改变变量的值，如果想要改变需要加 `mut`关键字

```rust
let mut x = 5;
x = 6;
```

# 二.常量

rust常量使用 `const`关键字声明，并且 `必须标明值的类型`

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

# 三.数据类型

## 1.标量类型

### 1.1 整型

| 长度    | 有符号    | 无符号    |
| ------- | --------- | --------- |
| 8-bit   | `i8`    | `u8`    |
| 16-bit  | `i16`   | `u16`   |
| 32-bit  | `i32`   | `u32`   |
| 64-bit  | `i64`   | `u64`   |
| 128-bit | `i128`  | `u128`  |
| arch    | `isize` | `usize` |

数字类型默认是 `i32`的，`isize` 和 `usize` 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的， 32 位架构上它们是 32 位的，整型的字面量有如下的形式

| 数字字面值                       | 例子            |
| -------------------------------- | --------------- |
| Decimal (十进制)                 | `98_222`      |
| Hex (十六进制)                   | `0xff`        |
| Octal (八进制)                   | `0o77`        |
| Binary (二进制)                  | `0b1111_0000` |
| Byte (单字节字符)(仅限于 `u8`) | `b'A'`        |

### 1.2 浮点型

类型为 `f32`和 `f64`，浮点类型默认是 `f64`

### 1.3 布尔型

类型为 `bool`，有 `true`和 `false`两个值

### 1.4 字符类型

类型为 `char`，Rust 的 `char` 类型的大小为四个字节(four bytes)，并代表了一个 Unicode 标量值（Unicode Scalar Value）

```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';
}
```

### 1.5 字符串类型

类型为 `str`，本质是UTF-8编码字符串数据，它通常以字符串slice的形式出现

## 2.复合类型

### 2.1 元组

类型为 `(T1, T2, T3, ...)`

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

可以使用模式匹配（pattern matching）来解构（destructure）元组值

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup;
}
```

可以使用点号（`.`）后跟值的索引来直接访问

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;
}
```

note：没有任何值的元组 `()` 是一种特殊的类型，只有一个值，也写成 `()` 。该类型被称为 **单元类型**（*unit type*），而该值被称为 **单元值**（*unit value*）。如果表达式不返回任何其他值，则会隐式返回单元值。

### 2.2 数组

类型为 `[T; N]`，T为类型，N为长度

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
let b = [3; 5]; //等同于let a = [3, 3, 3, 3, 3];
```

可以通过在方括号中指定初始值加分号再加元素个数的方式来创建一个每个元素都为相同值的数组

### 2.3 结构体

定义结构体的语法为 `struct T{...}`，就存在了一个类型为 `T`的结构体

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

`元组结构体（tuple structs）`是一种特殊的结构体，有自己的类型名，但没有具体的字段名，只有字段的类型

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

`类单元结构体（unit-like structs）`内没有字段，常用在某个类型上实现trait但不需要在类型中存储数据的时候发挥作用

```rust
struct AlwaysEqual;
fn main() {
    let subject = AlwaysEqual;
}
```

### 2.4 枚举

rust的枚举功能非常强大，可以将任意类型的数据放入枚举成员中，枚举和模式匹配会发挥出巨大的威力

- `Quit` 没有关联任何数据，可以看做类单元结构体
- `Move` 类似结构体包含命名字段，可以看做普通结构体
- `Write` 包含单独一个 `String`，可以看做元组结构体
- `ChangeColor` 包含三个 `i32`，可以看做元组结构体

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

有两个非常常用的枚举，Option和Result
- Option可以用来表示空值的概念，None和Some可以直接使用
- Result用来表示可能出错的情况
```rust
enum Option<T> {
    None,
    Some(T),
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

## 3.引用类型

### 3.1 引用

不可变引用的 `类型`为 `&T`，可变引用的类型为 `&mut T`

**引用**（*reference*）像一个指针，因为它是一个地址，使用(`&`)运算符来创建一个引用，使用(`*`)运算符来解引用

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

引用默认是不可变的，想要 `创建可变引用需要使用mut关键字`

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

### 3.2 slice

`slice本质也是引用，不具有所有权，字符串字面值就是slice`，这里 `s` 的类型是 `&str`：它是一个指向二进制程序特定位置的 slice。这也就是为什么字符串字面值是不可变的，因为 `&str` 是一个不可变引用

```rust
let s = "Hello, world!";
```

`数组也可以引用一部分作为slice`，下面slice的类型是 `&[i32]`，存储了数组元素的引用和集合长度

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];
assert_eq!(slice, &[2, 3]);
```

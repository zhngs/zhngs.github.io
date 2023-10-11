---
date: '2022-06-03'
---

# 一.Option

Rust 并没有空值，不过它拥有一个可以编码存在或不存在概念的枚举Option

```rust
enum Option<T> {
    None,
    Some(T),
}
```

只要一个值不是 `Option<T>` 类型，你就 **可以** 安全的认定它的值不为空。这是 Rust 的一个经过深思熟虑的设计决策，来限制空值的泛滥以增加 Rust 代码的安全性

# 二.Result
Rust使用Result来处理错误情况
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Result的unwrap和expect都会在出错时panic，区别是expect可以额外携带信息
```rust
let greeting_file = File::open("hello.txt").unwrap();
let greeting_file = File::open("hello.txt").expect("hello.txt should be included in this project");
```

Rust可以使用问号来简洁处理错误返回
- 如果未出错，返回值
- 如果出错，直接return相应的错误

以下是两个效果相同的函数
```rust
fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

# 三.vector

## 1.新建

可以用如下两种方法构造，第二种是使用宏`vec!`创建的，这个宏会根据我们提供的值来创建一个新的 vector

```rust
let v: Vec<i32> = Vec::new();
let v = vec![1, 2, 3];
```

## 2.遍历

获得vec内每个元素的不可变引用

```rust
fn main() {
    let v = vec![100, 32, 57];
    for i in &v {
        println!("{}", i);
    }
}
```

获得vec内每个元素的可变引用

```rust
fn main() {
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
}
```

## 3.增删改查

使用`push`可以添加元素

```rust
fn main() {
    let mut v = Vec::new();
    v.push(5);
}
```

使用`pop`返回Option包裹的元素

```rust
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    // Prints 3, 2, 1
    println!("{top}");
}
```

# 四.string

## 1.新建

可以使用如下三种方式新建字符串，`to_string`方法能用于任何实现了 `Display` trait 的类型

```rust
let mut s = String::new();
let s = "initial contents".to_string();
let s = String::from("initial contents");
```

## 2.遍历

rust中字符串无法索引，因为rust中字符串是UTF8编码，会出现多个字节表示一个字符的情况，此时索引没有意义

```rust
fn main() {
    let s1 = String::from("hello");
    let h = s1[0]; //报错
}
```

遍历字符串时要明确表示是遍历字符还是字节，如下代码按照字节遍历

```rust
for b in "नमस्ते".bytes() {
    println!("{}", b);
}
```

## 3.改变字符串

使用`push_str`和`push`来添加字符串和字符

```rust
fn main() {
    let mut s = String::from("foo");
    s.push_str("bar");
    l.push('l');
}
```

可以使用`+`运算符拼接字符串，这个语句会获取 `s1` 的所有权，附加上从 `s2` 中拷贝的内容，并返回结果的所有权

note：这里的`+`运算符实际使用的是add函数，签名类似`fn add(self, s: &str) -> String`，但例子中的第二个参数类型为`&String`，这个技术叫做 **Deref 强制转换**（*deref coercion*），可以理解为它把 `&s2` 变成了 `&s2[..]`

```rust
fn main() {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用
}
```

可以使用`format!`宏来拼接字符串

```rust
fn main() {
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");
    let s = format!("{}-{}-{}", s1, s2, s3);
}
```

## 4.字符串slice

字符串通过如下方式生成slice，但是要注意，如果slice截到不完整的UTF8编码，程序会panic

```rust
let hello = "дравствуйте";
let s = &hello[0..4];
```

# 五.HashMap

## 1.新建

```rust
use std::collections::HashMap;
let mut scores = HashMap::new();
```

## 2.遍历

使用for循环遍历hashmap

```rust
fn main() {
    use std::collections::HashMap;
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

## 2.增删改查

增和改使用`insert`，`insert`可以覆盖原来的值，也可以增加新值

查使用`get`函数，会返回`Option<V>`，有对应的键就返回Option包装的值，否则返回None

如果需要一种只有key不存在才插入的语义，可以使用`entry`和`or_insert`，`entry 函数的返回值是一个枚举Entry，它代表了可能存在也可能不存在的值，Entry的or_insert方法在键对应的值存在时就返回这个值的可变引用，如果不存在则将参数作为新值插入并返回新值的可变引用`

```rust
fn main() {
    use std::collections::HashMap;

    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);

    println!("{:?}", scores);
}
```

---
date: '2022-05-29'
---

# 一.概念

Rust 是一门基于表达式（expression-based）的语言，**语句**（*Statements*）是执行一些操作但不返回值的指令，表达式（*Expressions*）计算并产生一个值，`可以简单地理解为，语句后需要加分号，表达式后不需要加分号`

```rust
fn main() {
    let x = 1; // 语句
    let y = { // 大括号本身是一个表达式
        let x = 3;
        x + 1 
    };
}
```

note：大括号本身是一个表达式，`x + 1`后没带分号，表示返回表达式的值，`如果没有显式指定返回值，则表达式默认返回单元值()`

# 二.控制流

## 1.if

if语句用法如下

```rust
fn main() {
    let number = 6;
    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
```

可以看到if语句可以作为表达式返回值

```rust
fn main() {
    let condition = true;
    let number = if condition { 
        5 
    } else { 
        6 
    };
    println!("The value of number is: {}", number);
}
```

## 2.loop

loop创建一个无限循环

```rust
fn main() {
    loop {
        println!("again!");
    }
}
```

可以从loop中返回值

```rust
fn main() {
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is {}", result);
}
```

## 3.while

当条件为真，执行循环

```rust
fn main() {
    let mut number = 3;
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    println!("LIFTOFF!!!");
}
```

## 4.for

`for` 循环用来遍历集合，其安全性和简洁性使得它成为 Rust 中使用最多的循环结构

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    for element in a {
        println!("the value is: {}", element);
    }
}
```

## 5.match

`match` 关键字后跟一个表达式，接下来是 `match` 的分支，一个分支有两个部分：一个模式和一些代码，`=>` 运算符将模式和将要运行的代码分开

每个分支相关联的代码是一个表达式，而表达式的结果值将作为整个 `match` 表达式的返回值

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

匹配分支的另一个有用的功能是可以绑定匹配的模式的部分值，可从枚举成员中提取值

下述代码匹配 `Coin::Quarter` 成员的分支的模式中增加了一个叫做 `state` 的变量。当匹配到 `Coin::Quarter` 时，变量 `state` 将会绑定 25 美分硬币所对应州的值

```rust
#[derive(Debug)] // 这样可以立刻看到州的名称
enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

`match`支持通配模式，可以使用`_`来匹配其他情况，下述代码表示如果匹配到 3 或 7 以外的值，将无事发生，这里使用单元值`()`的意思是不会运行任何代码

```rust
fn main() {
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => (),
    }
}
```

## 6.if let

`if let`是`match`的一个语法糖，目的是来处理只匹配一个模式的值而忽略其他模式的情况

```rust
fn main() {
    let coin = Coin::Penny;
    let mut count = 0;
    if let Coin::Quarter(state) = coin {
        println!("State quarter from {:?}!", state);
    } else {
        count += 1;
    }
}
```

使用match的写法如下

```rust
fn main() {
    let coin = Coin::Penny;
    let mut count = 0;
    match coin {
        Coin::Quarter(state) => println!("State quarter from {:?}!", state),
        _ => count += 1,
    }
}
```

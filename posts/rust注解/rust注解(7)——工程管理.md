---
date: '2022-06-04'
---
# 一.模块系统

Rust 有许多功能可以让你管理代码的组织，包括哪些内容可以被公开，哪些内容作为私有部分，以及程序每个作用域中的名字。这些功能被称为 模块系统（the module system）

* **包** （ *Packages* ）：Cargo 的一个功能，它允许你构建、测试和分享 crate
* **Crates** ：一个模块的树形结构，它形成了库或二进制项目
* **模块** （ *Modules* ）和  **use** ：允许你控制作用域和路径的私有性
* **路径** （ *path* ）：一个命名例如结构体、函数或模块等项的方式

## 1.包

*包* （ *package* ）是提供一系列功能的一个或者多个 crate，一个包会包含一个 *Cargo.toml* 文件，阐述如何去构建这些 crate

包中可以包含至多一个库 crate(library crate)，包含任意多个二进制 crate(binary crate)

通过 `cargo new my-project` 可以创建一个新包

## 2.crate

crate 是 Rust 在编译时最小的代码单位，crate 有两种形式：二进制项和库

## 3.模块

* **从 crate 根节点开始** : 当编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是 *src/lib.rs* ，对于一个二进制 crate 而言是 *src/main.rs* ）中寻找需要被编译的代码
* **声明模块** : 在 crate 根文件中，你可以声明一个新模块；比如，你用 `mod garden`声明了一个叫做 `garden`的模块。编译器会在下列路径中寻找模块代码：
  * 内联，在大括号中，当 `mod garden`后方不是一个分号而是一个大括号
  * 在文件 *src/garden.rs*
  * 在文件 *src/garden/mod.rs*
* **声明子模块** : 在除了 crate 根节点以外的其他文件中，你可以定义子模块。比如，你可能在*src/garden.rs*中定义了 `mod vegetables;`。编译器会在以父模块命名的目录中寻找子模块代码：
  * 内联，在大括号中，当 `mod vegetables`后方不是一个分号而是一个大括号
  * 在文件 *src/garden/vegetables.rs*
  * 在文件 *src/garden/vegetables/mod.rs*
* **模块中的代码路径** : 一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。举例而言，一个 garden vegetables 模块下的 `Asparagus`类型可以在 `crate::garden::vegetables::Asparagus`被找到
* **私有 vs 公用** : 一个模块里的代码默认对其父模块私有。为了使一个模块公用，应当在声明时使用 `pub mod`替代 `mod`。为了使一个公用模块内部的成员公用，应当在声明前使用 `pub`
* **`use` 关键字** : 在一个作用域内，`use`关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用 `crate::garden::vegetables::Asparagus`的作用域，你可以通过 `use crate::garden::vegetables::Asparagus;`创建一个快捷方式，然后你就可以在作用域中只写 `Asparagus`来使用该类型

## 4.路径

路径有两种形式：

* **绝对路径** （ *absolute path* ）是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 `crate` 开头
* **相对路径** （ *relative path* ）从当前模块开始，以 `self`、`super` 或当前模块的标识符开头

路径需要用pub关键字来暴露，需要注意结构体前加pub和枚举前加pub的区别，结构体加了pub后字段还是私有的，枚举加了pub后就全是公有

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    // 在夏天订购一个黑麦土司作为早餐
    let mut meal = back_of_house::Breakfast::summer("Rye");
    // 改变主意更换想要面包的类型
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);

    // 如果取消下一行的注释代码不能编译；
    // 不允许查看或修改早餐附带的季节水果
    // meal.seasonal_fruit = String::from("blueberries");
}

mod back_of_house {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

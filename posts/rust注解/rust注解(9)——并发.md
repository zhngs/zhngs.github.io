---
date: '2022-10-14'
---
# 一.线程

以下是rust使用线程的简单例子

```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}

```

# 二.channel

线程间通过channel传递消息

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

# 三.Mutex`<T>`

Mutex的 `lock` 调用 **返回** 一个叫做 `MutexGuard` 的智能指针，这个智能指针实现了 `Deref` 来指向其内部数据，其也提供了一个 `Drop` 实现当 `MutexGuard` 离开作用域时自动释放锁

注意这里使用了Arc智能指针 ，Arc和Rc类似，只不过Arc的引用计数是原子性的，可以用于多线程

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

# 四.并发相关trait

## 1.Send trait

实现了 `Send` 的类型值的所有权可以在线程间传送，几乎所有的 Rust 类型都是 `Send` 的，不过有一些例外，比如裸指针和 `Rc<T>`

任何完全由 `Send` 的类型组成的类型也会自动被标记为 `Send`

## 2.Sync trait

实现了 `Sync` 的类型可以安全的在多个线程中拥有其值的引用，智能指针 `Rc<T>` 不是 `Sync` 的，出于其不是 `Send` 相同的原因， `RefCell<T>`和 `Cell<T>` 系列类型不是 `Sync` 的，`Mutex<T>` 是 `Sync`的

对于任意类型 `T`，如果 `&T`（`T` 的不可变引用）是 `Send` 的话 `T` 就是 `Sync` 的，这意味着其引用就可以安全的发送到另一个线程

完全由 `Sync` 的类型组成的类型也是 `Sync` 的

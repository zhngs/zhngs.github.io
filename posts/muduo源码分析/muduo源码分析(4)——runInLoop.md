---
date: '2022-06-02'
---

# 一.简介

`runInLoop`是muduo中很有用的一个函数，可以在IO线程内执行某个用户的任务回调，这个函数支持跨线程调用

# 二.runInLoop执行流程

runInLoop的思路是如果在IO线程中执行，那么可以直接执行回调函数，如果不在IO线程中，那么就把回调函数放在EventLoop的队列中，EventLoop维护了一个存储回调函数的vector名为`pendingFunctors_`

```rust
void EventLoop::runInLoop(const Functor& cb)
{
  if (isInLoopThread())
  {
    cb();
  }
  else
  {
    queueInLoop(cb);
  }
}
```

如果不在IO线程，那么会调用wakeup来唤醒IO线程，目的是为了尽快让回调函数得到处理。如果在IO线程，但是正在调用队列里的回调函数，也需要唤醒一次，因为执行完队列里的回调函数，会再次调用poll，如果此时没有IO事件，当前线程会阻塞

```rust
void EventLoop::queueInLoop(const Functor& cb)
{
  {
  MutexLockGuard lock(mutex_);
  pendingFunctors_.push_back(cb);
  }

  if (!isInLoopThread() || callingPendingFunctors_)
  {
    wakeup();
  }
}
```

在EventLoop的事件循环中，执行完IO事件，会执行`pendingFunctors_`内的回调函数

```rust
void EventLoop::doPendingFunctors()
{
  std::vector<Functor> functors;
  callingPendingFunctors_ = true;

  {
  MutexLockGuard lock(mutex_);
  functors.swap(pendingFunctors_);
  }

  for (size_t i = 0; i < functors.size(); ++i)
  {
    functors[i]();
  }
  callingPendingFunctors_ = false;
}
```

# 二.wakeup原理

EventLoop内部有一个eventfd和对应的Channel，在构造EventLoop的时候会注册eventfd的读事件，当调用wakeup函数的时候会向eventfd中写入数据，从而使poll调用返回

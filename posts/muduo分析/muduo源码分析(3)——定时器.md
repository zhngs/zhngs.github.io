---
date: '2022-06-02'
---

# 一.简介

muduo的EventLoop提供了定时器功能，可以在事件循环中设置定时事件，主要由`muduo/net/Timer`和`muduo/net/TimerQueue`提供

- `muduo/net/Timer`封装了单个定时器所需的各种数据，如过期时间，重复时间，回调函数等
- `muduo/net/TimerQueue`内部有一个Channel，可以向EventLoop注册事件，也存储了一个Timer set，用来对所有定时器按照过期时间排序

# 二.Timer

Timer的主要目的是为了将一个定时器所需的参数封装起来

Timer是对象语义，不可拷贝

# 三.TimerQueue

TimerQueue的主要目的

- 内部有一个timerfd和Channel，向EventLoop注册定时器时间

- 提供一个addTimer接口，供EventLoop使用，EventLoop使用addTimer封装了更好用的定时函数`runAt`、`runAfter`、`runEvery`

- 内部有一个Timer set，负责管理所有注册到TimerQueue的Timer

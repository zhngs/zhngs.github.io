---
date: '2022-05-31'
---

# 一.简介

muduo是基于事件循环的网络库，其中最核心的地方在于`事件分发`，EventLoop拿到IO事件，将其分发给文件描述符的事件处理函数

- `muduo/net/EventLoop`是事件循环的核心，其中有一个无限的事件循环，不断地执行poll，获得事件，然后执行事件的回调
- `muduo/net/Poller`是一个纯虚基类，主要目的是封装linux下poll和epoll系统调用
- `muduo/net/Channel`负责向事件循环中注册事件

# 二.EventLoop

EventLoop的主要目的是执行事件循环

EventLoop是对事件循环的封装，对象语义，不可拷贝

EventLoop内部组合了Poller，在一次事件循环中可以拿到IO事件，并将触发IO事件的文件描述符所在的Channel添加到EventLoop中的`activeChannels`数组，并遍历`activeChannels`，执行Channel中的回调函数

# 三.Poller

Poller的主要目的是执行poll调用，拿到IO事件，并将对应的Channel添加到EventLoop中的`activeChannels`数组

Poller是纯虚基类，有两个子类继承了Poller，分别实现了对poll和epoll的封装，对象语义，不可拷贝

Poller中有一个Channel数组，保存着注册在EventLoop中所有的Channel，通过poll调用找到有IO事件的文件描述符，并找到注册的Channel，将该Channel添加到EventLoop的`activeChannels`数组中

# 四.Channel

Channel主要的目的是向EventLoop中注册要监听的IO事件，EventLoop拿到IO事件后，会执行Channel中的处理函数

Channel中有一个文件描述符，但不负责关闭文件描述符，Channel内部存储着各种事件处理函数，如读函数，写函数等

Channel是EventLoop和外界沟通的通道，外界将要监听的事件和不同事件对应的回调函数告诉Channel，EventLoop从Channel中拿到这些信息，并在事件循环中执行

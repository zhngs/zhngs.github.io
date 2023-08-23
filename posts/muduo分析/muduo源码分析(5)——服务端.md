---
date: '2022-06-02'
---

# 一.简介

muduo为服务端程序编写提供了若干工具类

- `muduo/net/Acceptor`负责监听socket套接字，接收新连接

- `muduo/net/TcpServer`组合Acceptor，管理TcpConnection

- `muduo/net/TcpConnection`内部包含socket套接字，负责与对端通信

# 二.Acceptor

Acceptor主要目的是接受客户端连接，并将得到的socket套接字传入到回调函数中

Acceptor包含一个Socket和Channel，当启动的时候会向EventLoop注册读事件，当有新连接到来时，会触发IO事件

# 三.TcpServer

TcpServer内部组合Acceptor，会将自身的创建连接的函数注册到Acceptor中，当有新连接到来，会拿到新连接的sockfd，随后创建TcpConnection

TcpServer内部有一个map用来管理TcpConnection

TcpServer是暴露给用户的，用户需要设置如下两个回调，连接的回调在连接建立和连接关闭的时候会被触发，消息的回调会在收到消息时触发，这两个回调会被注册到TcpConnection中

```cpp
ConnectionCallback connectionCallback_;
MessageCallback messageCallback_;
```

# 四.TcpConnection

TcpConnection包含一个sockfd和对应的Channel，用来向EventLoop注册事件

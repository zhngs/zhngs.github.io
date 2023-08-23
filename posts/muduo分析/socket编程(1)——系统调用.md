---
date: '2022-05-30'
---

# 一.socket api

常用网络编程核心系统调用如下

- 想要进行网络通信，首先要考虑网络层，是使用ipv4还是ipv6，然后考虑传输层，使用tcp还是udp，`socket`调用的domain参数可以指定网络层的参数，type和protocol可以指定传输层的参数

- 想要使用tcp或者udp进行网络数据传输，首先要确定ip和port，sockaddr结构体里封装了主机的ip和port，`bind`调用将某一具体通信地址绑定给socket套接字，其中`addr和addrlen`是`传入参数`，需要调用者进行初始化，从addr参数的const属性也可以看出来

- tcp是c/s架构的，服务端想要进行被动连接就要`listen`

- tcp客户端想要连接到服务器，就要使用`connect`调用，可以将本地socket连接到服务端进行通信，其中`addr和addrlen`是`传入参数`，需要调用者进行初始化，表示服务端的通信地址

- `accept`调用是比较重要，作用是接受客户端的连接，并返回一个用于和客户端通信的套接字。accept的sockfd参数是监听套接字，`addr参数是传出参数`，不需要调用者初始化，返回时填充为客户端通信地址，`addrlen是传入传出参数`，调用者应该初始化其为传入的addr的长度，返回时填充为客户端通信地址的实际大小

```c
int socket(int domain, int type, int protocol);
int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
int listen(int sockfd, int backlog);
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);

ssize_t read(int fd, void *buf, size_t count);
ssize_t write(int fd, const void *buf, size_t count);

int close(int fd);
int shutdown(int sockfd, int how);
```

socket api理解起来比较简单

- 对客户端来说，无非就是获得socket套接字，连接到服务端进行通信

- 对服务端来说，无非就是获得socket套接字，设置套接字地址，接受客户端连接进行通信

socket api使用起来有些麻烦，但好消息是我们可以把复杂用法封装为简单操作

- 对于客户端，只需要封装一个connect函数，返回和服务端通信的句柄

- 对于服务端，可以将`socket、bind、listen`函数封装为`Listener`，负责监听客户端连接，Listener调用accept返回客户端连接

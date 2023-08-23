---
date: '2022-05-31'
---

# 一.简介

muduo在`muduo/net/SocketOps.h`、`muduo/net/InetAddress.h`、`muduo/net/Socket.h`中封装了linux下网络编程常用的系统调用

- SocketOps将系统调用封装到`muduo/net/sockets`命名空间中

- InetAddress将`sockaddr_in`和`sockaddr_in6`封装到InetAddress类中，使用union包装

- Socket封装socket文件描述符

# 二.InetAddress

InetAddress的目的是将套接字地址封装成一个数据类，方便使用

InetAddress类中没有析构函数，不需要做资源管理，该类是对数据做封装，是`值语义`

# 三.SocketOps

文件中没有类，只有封装的函数，主要目的是为其他文件提供封装好的socket函数，是muduo的socket操作最底下的一层

```rust
int  connect(int sockfd, const struct sockaddr* addr);
void bindOrDie(int sockfd, const struct sockaddr* addr);
int  accept(int sockfd, struct sockaddr_in6* addr);
```

有个细节是muduo封装的sockaddr相关的函数只需要传指针，不需要传长度，为什么？

- connect和bindOrDie函数不需要传长度的原因：使用者不再使用sockaddr_in或者sockaddr_in6，而是使用封装好的InetAddress，而InetAddress内部实际上是个union，长度等于sockaddr_in6的长度，只需要调用InetAddress的`getSockAddr`即可获得sockaddr地址

- accept函数不需要传长度的原因：使用者传入sockaddr_in6结构体，长度自然是知道的，不需要额外写长度

# 四.Socket

Socket类有析构函数，用来管理socket文件描述符，析构时会关闭socket文件描述符，典型的RAII管理资源，Socket类不能拷贝，属于`对象语义`

```cpp
void bindAddress(const InetAddress& localaddr);
int accept(InetAddress* peeraddr);
```

可以看到Socket的成员函数bindAddress和accept都是使用InetAddress的，较为便捷

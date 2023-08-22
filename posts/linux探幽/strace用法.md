---
date: '2022-07-24'
---

## 1.推荐用法

```shell
strace -tt -T -v -f -e trace=file -o /data/log/strace.log -s 1024 执行程序或者pid
```

- -tt 在每行输出的前面，显示毫秒级别的时间

- -T 显示每次系统调用所花费的时间

- -v 对于某些相关调用，把完整的环境变量，文件stat结构等打出来。

- -f 跟踪目标进程，以及目标进程创建的所有子进程

- -e 控制要跟踪的事件和跟踪行为,比如指定要跟踪的系统调用名称

- -o 把strace的输出单独写到指定的文件

- -s 当系统调用的某个参数是字符串时，最多输出指定长度的内容，默认是32个字节

- -p 指定要跟踪的进程pid, 要同时跟踪多个pid, 重复多次-p选项即可

## 2.e选项详解

Linux内核目前有300多个系统调用，详细的列表可以通过syscalls手册页查看。这些系统调用主要分为几类：

- 文件和设备访问类 比如open/close/read/write/chmod等，可以用`-e trace=file`

- 进程管理类 fork/clone/execve/exit/getpid等，可以用`-e trace=process`

- 信号类 signal/sigaction/kill 等，可以用`-e trace=signal`

- 内存管理 brk/mmap/mlock等，可以用`-e trace=memory`

- 进程间通信IPC shmget/semget 信号量，共享内存，消息队列等，可以用`-e trace=ipc`

- 网络通信 socket/connect/sendto/sendmsg 等，可以用`-e trace=network`

- 其他，如和文件描述符相关的系统调用可以用`-e trace=desc`过滤

## 3.实战

```shell
strace -tt -T -v -f -e trace=file ls
```

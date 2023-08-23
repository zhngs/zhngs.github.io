---
date: '2022-06-16'
---

# 一.简介

日志库分为前端和后端两部分，前端使用API接口生成日志消息，后端负责把日志消息写到目的地

muduo日志库前端

- `muduo/base/LogStream`
  
  - 定义LogStream类，用于重载<<操作符，流式化日志输出方式，将基本类型的数据格式成字符串通过append接口存入LogBuffer中
  
  - 定义Fmt类，用于格式化字符串
  
  - 定义FixedBuffer类，LogStream内部使用了fixedBuffer

- `muduo/base/Logging`，定义Logger类，提供设置日志级别和输出目的地的静态方法，内部包含LogStream，使用LogStream的<<操作符将文件名，日志级别，时间等信息格式好提前写入LogBuffer中

muduo日志库后端

- `muduo/base/FileUtil`，定义AppendFile类，用于操作本地日志文件的类，输出缓冲区大小64k字节，非线程安全的，目的是提高效率

- `muduo/base/LogFile`，以固定方式生成文件名并创建日志文件，实现日志滚动、日志缓存flush到日志文件的策略，LogFile内部包含AppendFile

多线程AsyncLogging类，是多线程下一个高效的非阻塞日志功能实现。前端仍然是Logger，只是将默认日志输出从stdout重定向到了AsyncLogging中，使用多缓冲技术，将输入缓冲、输出缓冲做高效的安全交换，供后端LogFile写入到文件

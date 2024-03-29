---
date: '2022-07-08'
---

# 一.c++注解的目的

- c++是我的第一门语言，对于这门语言，我是喜忧参半的，喜是这是一门伟大的语言，是对计算机世界影响极为广泛的语言，这门语言运用的好是一把利器，零成本的抽象和极快的运行效率使得c++编写高性能软件具有得天独厚的优势，忧是因为这是一门不好学的语言，语言特性太多太复杂，历史包袱很重，为了兼容c语言付出了很大的代价，c++创始人Bjarne Stroustrup也说过他不是不知道如何设计出比c++更优雅的语言

- c++的编程如同徒手攀登高山，一不留神就会滑入深渊，c++的复杂性和历史包袱也加重了这一点，所以`遵守最佳编程实践是很重要的一点`

- `我写c++注解的目的，一方面是总结自己在学习和使用c++过程中的心得和最佳编程实践，另一方面也是为了告诉后来者c++哪些东西需要重点学，哪些东西知道就好，哪些东西是语言学家需要考虑的事，哪些东西是编程中真正有用的利器`

- 如果你看到了某一节知识觉得我说的有道理，那么我写作的目的就达到了

# 二.c++注解适合哪些人

- 适合小白来确定学习路线和大纲，知道应该避开哪些坑，哪些知识是重要的，我不会事无巨细地讲所有知识，而是把所有知识的骨干提出来，这对于零基础小白来说，在学习之初有一个宏观的认识，是非常有益处的

- 适合有经验的c++使用者，可以学习我认为的最佳编程实践，如果觉得有争议的地方可以加群和我讨论，希望能为彼此前进的路上出一把力

# 三.我的c++后台开发路线

## 1.c++基础学习阶段

- 这一个阶段主要是积累c++的基础知识，这个阶段我是通过`观看侯捷老师的课程`学习的

- 课程的观看顺序是
  
  - c++面向对象高级开发，学完这个后c++的基础知识就足够了
  
  - stl和泛型编程，学完这个后就知道stl容器如何使用以及底层原理，还可以了解泛型在c++中的强大作用，初学者不用去研究泛型，知道其存在就行
  
  - c++标准11-14，学完这个后可以了解c++的新标准有哪些，很重要
  
  - c++内存管理，这个可以浅尝辄止，等到需要用到的时候再来看，不适合新手

- 一定要注意记笔记，记笔记的方法可以看我的另一篇博客marktext推荐，这个阶段完成后，c++的基础就已经可以了，但是离工作要求还很远

## 2.设计模式学习阶段

- 这个阶段比较简单，只需要学习一些简单的设计模式，如单例模式、工厂模式、策略模式等

- 本来我是观看李建忠老师的c++设计模式的课程，但是b站已经下架，现在可以看黑马的设计模式课程，设计模式虽然有23种，但是有用的就那么几种，知道设计模式的概念就可以

- `设计模式的核心思想：不是消灭变化，而是把变化都驱赶到一个地方`

- [黑马设计模式链接](https://www.bilibili.com/video/BV1Mb411t7ut?spm_id_from=333.337.search-card.all.click)

## 3.linux基础学习阶段

- 上一个阶段完成后，只是单纯知道c++的语言基础，可以刷题，但是做不出来实际的东西，如今后台的程序都是跑在linux上的，不懂linux是完全不合格的

- 这个阶段我`推荐去b站看课程，尤其是黑马的一门linux课程我极力推荐`，链接如下，学习完这门课程可以让你了解到linux的方方面面，会接触到ssh，网络编程，系统编程，shell脚本编写等

- [黑马linux教程链接](https://www.bilibili.com/video/BV1dt411f7TZ?spm_id_from=333.337.search-card.all.click)

- 这个阶段完成后，只是对linux初窥门径，距离达到工作要求又近了一步，这时你就会领略到linux系统的美妙，进一步加深自己对于计算机世界的认知

## 4.linux网络编程学习阶段

- 后台开发工程师无时无刻不和网络打交道，学好linux平台下的网络编程，摸清楚linux网络协议栈的脾气是非常重要的

- 这个阶段我`推荐一门课程和四本书，非常重要，非常重要，非常重要!!!`
  
  - 课程是陈硕的[网络编程实践课](https://www.bilibili.com/video/BV1TA411q75p?spm_id_from=333.337.search-card.all.click)，这个课程讲述了在linux下进行网络编程的注意事项，强烈推荐
  
  - 四本书是`《unix环境高级编程》、《unix网络编程卷1》、《tcp/ip详解卷1》、《Linux多线程服务端编程：使用muduo c++网络库》`，前三本可以当作字典书来查，最后一本陈硕大神的书我反复看了很多遍，每一遍都有新的感受
  
  - `公众号程序员既白，回复网络编程书籍，有这四本书的pdf版，内附书签`

- 这个阶段完成的标志是可以使用muduo完成简单的网络编程任务，网络编程实践课能够看懂，《Linux多线程服务端编程》这本书至少看了一遍

## 5.掌握网络库源码阶段

- 这个阶段的任务是`掌握muduo库源码`，muduo是一个传统的基于事件回调的网络库，核心代码只有5000行，性能很高，非常适合新手学习，需要至少通读一遍muduo源码并理解

- 这个阶段完成后，实际上已经达到工作要求，算是踏进了c++后台开发的门槛

## 6.面试

- 后台技术人员面试，第一大关就是笔试，笔试完之后聊你对技术的认知和理解，经过前面阶段的学习之后，对技术的认知和理解是没有问题的，主要问题是笔试，也就是做算法题

- 笔试并不难，但是不刷题，是肯定做不出来的，我推荐`leetcode网站刷题200～300道`，这时候笔试就完全不是问题

## 7.技术进阶

- 这个阶段看个人的工作定位了，可以学习协程，可以学习数据库技术，如mysql，redis等，也可以研究网络协议等技术

- 同样可以学习其他流行语言与go、rust

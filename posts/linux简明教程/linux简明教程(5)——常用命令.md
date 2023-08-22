---
date: '2022-05-12'
---

# 一.文件操作

## 1.新建

- 新建文件可以使用touch命令
  
  ```shell
  $ touch build.sh # 新建build.sh文件
  ```

- 新建目录使用mkdir命令
  
  ```shell
  $ mkdir work # 新建work文件夹
  ```

## 2.复制

- 使用cp命令可以进行复制，语法为`cp <源文件> <目标目录>`，可以达到将源文件复制到目标目录下的效果
  
  ```shell
  $ cp build.sh .. # 复制build.sh到上一级目录
  ```

- 如果要复制目录的话，需要加上`-rf`参数，r的意思是递归复制目录下所有文件，f的意思是强制执行，不会有询问信息弹出。语法为`cp -rf <源目录> <目标目录>`，可以将源目录复制到目标目录下
  
  ```shell
  $ cp -rf work .. # 复制work目录到上一级目录
  ```

## 3.移动

- 使用mv命令可以移动文件，语法为`mv <源文件或目录> <目标目录>`，能够将文件或目录移动到目标目录下
  
  ```shell
  $ mv work .. # 将work目录移动到上一级
  ```

- note：使用mv可以做到重命名的效果，语法为`mv <文件或目录> <新名字>`，注意此时新名字不能是一个已经存在的目录，不然会将文件移动到该目录下，而不是重命名的效果
  
  ```shell
  $ mv work mywork # 将work文件夹重命名为mywork
  ```

## 4.改变权限

- 使用chmod命令可以改变文件权限，chmod命令的用法较多，但只需要记住一种常用的就可以，那就是数字表示法。文件权限对于文件所有者，组，其他人这三类成员，都有3种权限，即rwx，如果把rwx看成二进制的话，r代表的是4，w代表的是2，x代表的是1，合起来最大权限就是7。chmod语法为`chmod <数字> <文件或文件夹>`
  
  ```shell
  $ chmod 777 work # 开启work文件夹的全部权限
  ```

## 5.压缩与解压

- gz，bz2后缀的压缩文件使用tar命令
  
  ```shell
  tar -cvf work.tar.gz work # 将work文件夹压缩为work.tar.gz
  tar -xvf work.tar.gz    # 将work.tar.gz解压
  ```

## 6.查看文件行数

- `wc -l <文件名>`，可以打印出某个文件的行数
  
  ```shell
  $ wc -l stream.ts
  508 stream.ts
  ```

# 二.机器指标

## 1.操作系统版本

- `uname -a`可以查看内核信息，从以下信息可以看到，centos系统，内核版本为4.18，机器架构为x86_64
  
  ```go
  $ uname -a
  Linux VM-24-8-centos 4.18.0-305.10.2.el8_4.x86_64 #1 SMP Tue Jul 20 17:25:16 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
  ```

## 2.发行版版本

- `cat /etc/os-release `可以查看发行信息，可以看到该机器为centos8
  
  ```shell
  $ cat /etc/os-release 
  NAME="CentOS Linux"
  VERSION="8 (Core)"
  ID="centos"
  ID_LIKE="rhel fedora"
  VERSION_ID="8"
  PLATFORM_ID="platform:el8"
  PRETTY_NAME="CentOS Linux 8 (Core)"
  ANSI_COLOR="0;31"
  CPE_NAME="cpe:/o:centos:centos:8"
  HOME_URL="https://www.centos.org/"
  BUG_REPORT_URL="https://bugs.centos.org/"
  
  CENTOS_MANTISBT_PROJECT="CentOS-8"
  CENTOS_MANTISBT_PROJECT_VERSION="8"
  REDHAT_SUPPORT_PRODUCT="centos"
  REDHAT_SUPPORT_PRODUCT_VERSION="8"
  ```

## 3.cpu信息

- 使用`ls cpu`可以查看cpu信息，可以看到该机器的CPU是双核的，字节序是小端序的
  
  ```shell
  $ lscpu
  Architecture:        x86_64
  CPU op-mode(s):      32-bit, 64-bit
  Byte Order:          Little Endian
  CPU(s):              2
  On-line CPU(s) list: 0,1
  Thread(s) per core:  1
  Core(s) per socket:  2
  Socket(s):           1
  NUMA node(s):        1
  Vendor ID:           GenuineIntel
  BIOS Vendor ID:      Smdbmds
  CPU family:          6
  Model:               85
  Model name:          Intel(R) Xeon(R) Platinum 8255C CPU @ 2.50GHz
  BIOS Model name:     3.0
  Stepping:            5
  CPU MHz:             2494.140
  BogoMIPS:            4988.28
  Hypervisor vendor:   KVM
  Virtualization type: full
  L1d cache:           32K
  L1i cache:           32K
  L2 cache:            4096K
  L3 cache:            36608K
  NUMA node0 CPU(s):   0,1
  Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl cpuid tsc_known_freq pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 arat avx512_vnni
  ```

## 4.内存信息

- 使用`free -h`可以查看内存信息，h参数的缩写是human，作用是将数据换成人易读的形式
  
  ```shell
  $ free -h
                total        used        free      shared  buff/cache   available
  Mem:          3.6Gi       933Mi       1.8Gi       1.0Mi       957Mi       2.5Gi
  Swap:            0B          0B          0B
  ```

- 可以看到总内存为3.6G，剩余的内存为2.5G

## 5.硬盘信息

- 使用`lsblk`可以查看有几个硬盘，每个硬盘的分区情况，可以看到有一个硬盘vda，只有一个分区vda1，挂载在根目录下
  
  ```shell
  $ lsblk
  NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
  sr0     11:0    1 158.6M  0 rom  
  vda    253:0    0    80G  0 disk 
  └─vda1 253:1    0    80G  0 part /
  ```

- `df -h`命令更常用，能够显示更多信息
  
  ```shell
  Filesystem      Size  Used Avail Use% Mounted on
  devtmpfs        1.9G     0  1.9G   0% /dev
  tmpfs           1.9G   24K  1.9G   1% /dev/shm
  tmpfs           1.9G  464K  1.9G   1% /run
  tmpfs           1.9G     0  1.9G   0% /sys/fs/cgroup
  /dev/vda1        79G   25G   51G  34% /
  tmpfs           374M     0  374M   0% /run/user/0
  ```

# 三.查看文本

## 1.cat

- cat命令之前已经说过，作用是显示文本内容到终端上

## 2.vim

> vim是linux命令行下及其重要的一个文本编辑器，可以说如果没有掌握vim，那么在linux下就是残废

- vim的学习还是比较复杂的，快捷键较多，对于简单查看文本来说只需要掌握两个用法就可以
  
  - 想要使用vim打开文件，直接`vim <文件名>`就可以
  
  - 想要退出的时候，按下冒号键，可以看到左下角出现冒号，输入`q!`按下回车就可以退出

# 四.进程

## 1.查看进程

- `ps -aux`可以用unix风格查看系统中所有进程，可以看到每个进程的pid是多少
  
  ```shell
  USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
  root           1  0.0  0.2 183804  8848 ?        Ss   May09   0:07 /usr/lib/systemd/systemd --switched-root --system --deserialize 17
  root           2  0.0  0.0      0     0 ?        S    May09   0:00 [kthreadd]
  root           3  0.0  0.0      0     0 ?        I<   May09   0:00 [rcu_gp]
  root           4  0.0  0.0      0     0 ?        I<   May09   0:00 [rcu_par_gp]
  ```

- 最常用的用法是`ps -aux | grep "特定信息"`，可以寻找包含特定信息的进程。`|`是shell的管道运算符，作用是将上一条命令的输出下一条命令的输入，grep命令的作用是在给定的文本中查找包含特定字符串的行，`这个用法非常重要，需要掌握`

## 2.终止进程

- 使用`kill -9 <进程pid>`可以向进程发送KILL信号，该信号的值为9

## 3.进程cpu使用率

- 使用`top`可以动态查看cpu使用率

# 五.寻找特定文件

## 1.find命令

- `find -name "*.py"`，可以寻找当前目录以及所有子目录下面后缀为py的文件，并打印在终端上，`*`表示通配符，可以代替任何字符串

- note：介绍一个`非常实用的技巧`，假如想要评估一个项目下所有py后缀的文件行数，可以使用如下命令，命令中的`反引号的意义是将反引号内部的命令先执行，然后替换成命令执行输出的结果`。find命令可以找到所有后缀名为py的文件，wc命令可以统计文件的行数，将两者组合在一起，就可以达到非常实用的效果
  
  ```shell
  $ wc -l `find -name "*.py"`
  ```

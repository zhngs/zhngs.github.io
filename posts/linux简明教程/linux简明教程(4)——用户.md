---
date: '2022-05-11'
---

# 一.用户概念

- linux是一个支持`多用户`的操作系统，多人同时登录在一台linux系统上进行操作是家常便饭的事，`对于shell来说，执行命令的实体是用户`
- 用户有两个重要的概念，`uid`和`gid`，分别表示user id和group id。在linux中使用一个具体的数字来表示用户，那就是uid。每个用户都有一个伴生组，这个伴生组的id叫做gid
  - note：`对于普通用户来说，uid=gid，且用户名和伴生组的名字是一样的`

# 二./etc/passwd

- linux会将用户信息储存在/etc/passwd文件中，可以使用cat命令查看该文件内容，`cat命令的作用是将文件内容显示在终端上`
  
  ```shell
  $ cat /etc/passwd
  root:x:0:0:root:/root:/usr/bin/zsh
  bin:x:1:1:bin:/bin:/sbin/nologin
  daemon:x:2:2:daemon:/sbin:/sbin/nologin
  adm:x:3:4:adm:/var/adm:/sbin/nologin
  lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
  sync:x:5:0:sync:/sbin:/bin/sync
  shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
  halt:x:7:0:halt:/sbin:/sbin/halt
  mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
  operator:x:11:0:operator:/root:/sbin/nologin
  games:x:12:100:games:/usr/games:/sbin/nologin
  ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
  nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
  dbus:x:81:81:System message bus:/:/sbin/nologin
  systemd-coredump:x:999:997:systemd Core Dumper:/:/sbin/nologin
  systemd-resolve:x:193:193:systemd Resolver:/:/sbin/nologin
  tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin
  polkitd:x:998:996:User for polkitd:/:/sbin/nologin
  unbound:x:997:994:Unbound DNS resolver:/etc/unbound:/sbin/nologin
  libstoragemgmt:x:996:993:daemon account for libstoragemgmt:/var/run/lsm:/sbin/nologin
  cockpit-ws:x:995:991:User for cockpit-ws:/:/sbin/nologin
  setroubleshoot:x:994:990::/var/lib/setroubleshoot:/sbin/nologin
  sssd:x:993:989:User for sssd:/:/sbin/nologin
  insights:x:992:988:Red Hat Insights:/var/lib/insights:/sbin/nologin
  sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
  chrony:x:991:987::/var/lib/chrony:/sbin/nologin
  tcpdump:x:72:72::/:/sbin/nologin
  syslog:x:990:986::/home/syslog:/bin/false
  cockpit-wsinstance:x:989:985:User for cockpit-ws instances:/nonexisting:/sbin/nologin
  rngd:x:988:984:Random Number Generator Daemon:/var/lib/rngd:/sbin/nologin
  lighthouse:x:1000:1000::/home/lighthouse:/bin/bash
  redis:x:987:983:Redis Database Server:/var/lib/redis:/sbin/nologin
  caddy:x:986:982:Caddy web server:/var/lib/caddy:/sbin/nologin
  mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false
  nginx:x:985:981:Nginx web server:/var/lib/nginx:/sbin/nologin
  ```

- /etc/passwd文件内容以冒号作为分隔，共有7列，意义为`用户名：密码占位符：uid：gid：用户描述：用户家目录：登录后使用的shell`

- 上述内容重点看两个用户：一是root用户，二是lighthouse用户。root用户是系统中的特权用户，不会有任何权限限制，相当于系统的主人。lighthouse用户代表普通用户，一些敏感操作是受限的。不难发现，root用户的uid和gid都是0，而lighthouse用户的uid和gid是1000
  
  - note：`root用户的uid和gid必然都是0，普通用户的uid和gid最小等于1000，在/etc/passwd文件中所有大于等于1000的用户，都是普通用户。介于0和1000之间的一般都是系统用户，新手不需要深入了解`

# 三.id命令

- id命令允许查看某个用户的uid，gid和该用户所属的所有组
  
  ```shell
  $ id lighthouse
  uid=1000(lighthouse) gid=1000(lighthouse) groups=1000(lighthouse)
  ```

- note：linux下之所以有组的概念，可以考虑以下场景：一台linux机器被3个导师和这三个导师的学生所使用，当A导师有一个项目，就可以新建一个文件夹，`该文件夹的所有者是A导师，所有组是A导师的伴生组，权限为rwxrwx---`，此时A导师就可以将他名下的学生的用户名加入到A导师的伴生组中，就可以达到这样一种效果————`A导师和A导师的学生可以访问该文件夹，但其他导师和学生不能访问`

# 四.操作用户的命令

- 系统管理员可以新建用户，删除用户等，但这些操作比较危险，且使用频率很低。对于新手来说，`重点在于理解uid和gid，懂得文件权限的限制就可以`

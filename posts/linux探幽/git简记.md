---
date: '2022-07-24'
---

## 1.git用户配置

- `git config list` 查看配置信息

- `git config --global user.name "用户名"` 定义全局的用户名
  `git config --global user.email "邮箱"` 定义全局的邮件地址

- 在.git/config的文件下可以配置局部的用户名和邮箱，并且可以覆盖全局变量

- `ssh-keygen -t rsa` 生成密钥

## 2.基础命令

- `git init` 初始化仓库

- `git add 文件` 向暂存区提交文件

- `git add .` 向暂存区提交所有文件

- `git commit`，向仓库提交暂存区的文件，形成记录

- `git commit --amend`，改写最近的提交注释

- `git reset`，取消暂存区的内容

- `git reset --hard`，取消暂存区和工作区的内容

- `git reset --hard 节点名`，回退到指定节点

- `git reset --hard ORIG_HEAD`，回到上一次HEAD节点的位置

## 3.分支

- `git branch 分支名`，创建分支

- `git branch -d 分支名`，删除分支

- `git branch -a`，查看所有分支

- `git checkout 分支名`，切换分支

- `git checkout -b 分支名`，创建并切换分支

- `git merge 节点名`，将指定节点和HEAD节点合并

- `git rebase 节点名`，将指定节点和HEAD节点rebase合并，也就是将当前节点移动到指定节点前

## 4.远端

- `git pull`，将远端xxx分支内容拉取到本地的orign/xxx分支，并和本地的xxx分支merge，如果有冲突，需要先解决冲突，再手动合并

- `git fetch`，将远端所有xxx分支内容拉取到本地的orign/xxx分支

- `git push`，将本地分支push到远程仓库对应分支，如果发生冲突，push会被拒绝的

- `git push origin main`，切到本地仓库中的main分支，获取所有的提交，再到远程仓库origin中找到main分支，将远程仓库中没有的提交记录都添加上去

## 5.标签

- `git tag 标签名`，给HEAD所在节点添加标签

- `git tag -a 标签名`，给HEAD所在节点添加标签，并且可以写注解

- `git tag -n`，查看所有标签

- `git tag -d 标签名`，删除标签

## 6.进阶

- `git revert HEAD`，使用提交的方式取消HEAD所在的节点

- `git cherry-pick 节点名 节点名 ...` 将节点名按照顺序放在HEAD后

- `git describe` 查找离HEAD最近的tag

## 7.经典场景

- 大家将更新推送到develop分支，此时自己本地的develop分支不是最新的，应该git fetch下载最新的orign/develop，然后git rebase orgin/develop，最后git push即可

- 远端master分支收到保护，但是在本地的master分支上已经提交了commit，此时应该新建分支 git checkout -b feature，然后git push，最后git reset --hard orgin/master 将master退回到和远端分支一样的节点

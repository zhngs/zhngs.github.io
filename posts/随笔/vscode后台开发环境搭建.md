---
date: '2022-07-07'
---

# 一.鹅厂推荐开发环境

- vim，这是我非常喜欢的一个编辑器，被誉为“编辑器的神”，vim的哲学是一切事情都可以使用键盘来完成。vim的优点是码字效率很高，有很多快捷键，但缺点是没有语法自动补全，自动纠错等现代编辑器等功能，虽然可以通过配置插件来实现，但是插件的配置比较复杂，有时候兼容性也是问题

- vscode，我的评价是，宇宙级编辑器，也是目前最流行的现代编辑器。vscode的优点是生态特别好，有非常多的插件，并且插件的配置非常容易，开箱即用，配上vim插件可以在vscode内实现

那么应该选择哪种开发环境？我在编码和看开源代码的过程中，非常讨厌那种臆造抽象，一旦抽象不合理，那么整个架构到后期去修改是非常痛苦的，代码本应该是`简洁实用`的，用`20%的技术手段可以解决80%的问题`，这也影响了我选择开发环境的想法

我认为一个好的开发环境应该满足如下几点：

- 开箱即用，配置简单，只需要配置非常少的东西就可以有强大的功能

- 拥有vim的打字模式

- 支持多语言

- 界面美观

综上所述，我选择vsocde

# 二.主题与字体

- 主题我推荐：`Monokai`，这个主题用着非常舒服，并且vscode是自带的，简单设置一下就行了

- 字体我推荐：`Consolas`，这个字体在windows下自带，但是mac下没有，最简单的安装办法就是下载一个office word，在word源代码里有consolas的字体库，安装即可，这里有[相关博客](https://blog.csdn.net/nmyphp/article/details/101032206)。vscode设置字体的方法是打开设置，在控制字体的最前面输入`Consolas`就可以了

# 三.必备插件

- 简体中文插件，在拓展里面搜索`Chinese`就可以

- vscode-icons插件，可以美化vscode的图标

- Remote - SSH插件，用来ssh连接服务器，配置也非常简单，[VScode:Remote-SSH插件配置_抬头看，是蓝天的博客-CSDN博客](https://blog.csdn.net/AhznuIOT/article/details/117459364)

- Vim插件，可以将vim融入vscode，体验非常好

还有非常多好用的插件，可以等用到的时候再去安装

# 四.vscode快捷键

- 实际工作中我用到最多的一个快捷键是`ctrl+反引号`，反引号是esc下面的那个按键，可以快速调出来终端

- `ctrl + tab`可以切换选项卡，同样很实用

- `F1`可以打开vsocde的命令窗口，可以执行一些例如打开首选项，重启vscode的操作

# 五.vim插件配置

安装完vim插件之后，需要对vim插件进行一些配置，下面的配置是我从官方推荐配置中节选的我觉得最实用的配置，只需要在首选项中粘贴进去就行了，打开首选项的方法是按下`F1`，输入`打开设置(json)`，选择相应选项就可以打开首选项设置

```json
    "vim.easymotion": true,
    "vim.incsearch": true,
    "vim.useSystemClipboard": true,
    "vim.useCtrlKeys": true,
    "vim.hlsearch": true,
    "vim.insertModeKeyBindings": [
      {
        "before": ["j", "j"],
        "after": ["<Esc>"]
      }
    ],
    "vim.normalModeKeyBindingsNonRecursive": [
      {
        "before": ["leader", "w"],
        "commands": [
            "workbench.action.files.save",
        ]
      }
    ],
    "vim.leader": ";"
```

# 六.vim常用快捷键

- `h, j, k, l`控制光标方向

- `e`光标向后一个单词

- `b`光标向前一个单纯

- `yy`，复制一行，前面加数字可以复制相应数目行

- `p`，粘贴

- `dd`，删除一行，前面加数字可以删除相应数目行

- `/xxxxx`，搜索相应内容

以上这些是vim原生支持的按键，我只列举出了一小部分，感兴趣的可以自行搜索

vim插件支持的快捷键如下：

- `jj`可以取消输入模式

- `;w`可以保存文件

- `;; + (h/j/k/l)`，可以快速移动光标到任意位置，j可以跳到下面任意一行，k可以跳到上面任意一行，h可以跳到前面任意单词的开始或结尾，l可以跳到后面任意单词的开始或结尾

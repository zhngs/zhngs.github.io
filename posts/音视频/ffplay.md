---
date: '2023-03-24'
---

## 一.语法
ffplay \[options\] \[input_url\]
## 二.简介
ffplay是一个简单的媒体播放器，使用FFmpeg库和SDL库构建
## 三.选项
### 1.主要选项
- -x width，强制显示宽度
- -y height，强制显示高度
- -fs，全屏
- -an，禁止音频
- -vn，禁止视频
- -sn，禁止字幕
- -ss pos，seek到pos，pos必须是一个持续时间规范
- -t duration，播放时间
- -bytes，通过字节数进行seek
- -seek_interval，设置自定义间隔，以秒为单位，使用左/右键seek，默认10s
- -nodisp，禁用图形显示
- -noborder，无边框窗口
- -alwaysontop，窗口总是在最前面
- -volume，设置音量，范围\[0, 100\]
- -f fmt，强制格式
- -window_title title，设置窗口名字，默认为文件名
- -left title，设置窗口左侧的x位置，默认为居中窗口
- -top title，设置窗口顶部的y位置，默认为居中窗口
- -loop number，循环播放number次，0表示无限循环
- -showmode mode，设置显示的模式，默认值为视频，如果视频不存在或无法播放，则自动选择rdft。按w键以交互方式循环显示可用的显示模式
	- '0, video'，显示视频
	- '1, waves'，显示音频波
	- '2, rdft'，使用RDFT（（逆）实离散傅里叶变换）显示音频频带
- -vf filtergraph，过滤视频流，按w键循环显示指定的过滤图和显示模式
- -af filtergraph，过滤音频流
- -i，输入url
### 2.高级选项
- -stats，打印几个播放统计信息，特别是显示流持续时间、编解码器参数、流中的当前位置和音频/视频同步漂移，默认显示
- -fast，不符合规范的优化
- -genpts，生成pts
- -sync type，将主时钟设置为音频(`type=audio`)、视频(`type=video`)或外部(`type=ext`)，默认为音频，主时钟用于控制音视频同步
- -ast audio_stream_specifier，使用给定的流说明符选择所需的音频流
- -vst video_stream_specifier，使用给定的流说明符选择所需的视频流
- -sst subtitle_stream_specifier，使用给定的流说明符选择所需的字幕流
- -autoexit，视频播放完毕退出
- -exitonkeydown，按任意键退出
- -exitonmousedown，按任何鼠标按钮退出
- -codec:media_specifier codec_name，为media_specifier标识的流强制执行特定的解码器实现，它可以采用值`a`(audio)、`v`(video)和`s`(subtitle)
- -acodec codec_name，强制使用特定的音频解码器
- -vcodec codec_name，强制使用特定的视频解码器
- -scodec codec_name，强制使用特定的字幕解码器
- -autorotate，根据文件元数据自动旋转视频，默认启用
- -framedrop，如果视频不同步，则丢弃视频帧，如果主时钟未设置为视频，则默认启用
- -infbuf，不要限制输入缓冲区的大小，尽快从输入中读取尽可能多的数据，默认情况下为实时流启用
- -filter_threads nb_threads，定义用于处理过滤器管道的线程数
### 3.播放时选项
- q, ESC：退出
- f，切换全屏模式
- p, SPC：暂停
- m，静音
- 9, 0：减少或增加音量
- /, \*：减少或增加音量
- a，循环音频通道
- v，循环视频通道
- t，循环字幕通道
- c，循环程序
- w，循环显示模式或者过滤器
- s，进入下一帧，然后暂停
- left/right，快退/快进（10s）
- down/up，快退/快进（1min）
- page down / page up：查找上一章/下一章，如果没有章节向后/向前seek 10分钟
- 鼠标右键：seek到与宽度分数相对应的百分比
- 鼠标左键双击：切换全屏
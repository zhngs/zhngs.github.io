---
date: '2023-03-22'
---

> 官方文档：https://ffmpeg.org/ffmpeg.html

## 一.概述
- **ffmpeg**是快速的音视频转换器
- ffmpeg从选项指定的任意数量的输入文件（可以是常规文件、管道、网络流、抓取设备等）中读取，并写入任意数量的输出文件
- 将输出文件的视频比特率设置为 64 kbit/s
	```shell 
	ffmpeg -i input.avi -b:v 64k -bufsize 64k output.avi
	```
- 将输出文件的帧速率强制为 24 fps
	```shell
	ffmpeg -i input.avi -r 24 output.avi
	```
- 将输入文件的帧速率（仅对原始格式有效）强制为1fps，将输出文件的帧速率强制为24fps
	```shell
	ffmpeg -r 1 -i input.m2v -r 24 output.avi
	```

## 二.语法

```shell
ffmpeg [global_options] {[input_file_options] -i input_url} ... {[output_file_options] output_url} ...
```

## 三.细节
### 1.转码
- ffmpeg调用libavformat读取输入文件并从中获取包含编码数据的数据包，然后将编码的数据包传递给解码器。解码器产生未压缩的帧 (raw video/PCM audio/...)，可以通过过滤进一步处理。过滤后，帧被传递给编码器，编码器对它们进行编码并输出编码数据包。最后，这些被传递给 muxer，它将编码的数据包写入输出文件
	```
	 _______              ______________
	|       |            |              |
	| input |  demuxer   | encoded data |   decoder
	| file  | ---------> | packets      | -----+
	|_______|            |______________|      |
	                                           v
	                                       _________
	                                      |         |
	                                      | decoded |
	                                      | frames  |
	                                      |_________|
	 ________             ______________       |
	|        |           |              |      |
	| output | <-------- | encoded data | <----+
	| file   |   muxer   | packets      |   encoder
	|________|           |______________|
	```
### 2.过滤
- 简单过滤，简单地在解码和编码之间插入一个额外的步骤，比如控制帧速率，画面伸缩等
	```
	 _________                        ______________
	|         |                      |              |
	| decoded |                      | encoded data |
	| frames  |\                   _ | packets      |
	|_________| \                  /||______________|
	             \   __________   /
	  simple     _\||          | /  encoder
	  filtergraph   | filtered |/
	                | frames   |
	                |__________|
	```
- 复杂过滤，当图形具有多个输入和/或输出时，或者输出流类型与输入不同时，就是这种情况，比如将两个视频叠加到一个视频上
	```
	 _________
	|         |
	| input 0 |\                    __________
	|_________| \                  |          |
	             \   _________    /| output 0 |
	              \ |         |  / |__________|
	 _________     \| complex | /
	|         |     |         |/
	| input 1 |---->| filter  |\
	|_________|     |         | \   __________
	               /| graph   |  \ |          |
	              / |         |   \| output 1 |
	 _________   /  |_________|    |__________|
	|         | /
	| input 2 |/
	|_________|
	```
### 3.流复制
- 流复制是向编解码器制定`-copy`选项，省略了编码和解码过程，只需要解复用和复用，对于更改容器格式或修改容器级元数据很有用
```
 _______              ______________            ________
|       |            |              |          |        |
| input |  demuxer   | encoded data |  muxer   | output |
| file  | ---------> | packets      | -------> | file   |
|_______|            |______________|          |________|
```

## 四.码流选择
ffmpeg提供`-map`作为在每个输出文件中手动控制流选择的选项，如果跳过ffmpeg会执行自动码流选择
### 1.自动码流选择
它将根据以下标准选择该流：
- 对于视频，它是具有最高分辨率的流
- 对于音频，它是通道最多的流
- 对于字幕，它是找到的第一个字幕流，但是要注意输出格式的默认字幕编码器可以是基于文本的或基于图像的，并且只会选择相同类型的字幕流
- 在相同类型的多个流速率相同的情况下，选择具有最低索引的流
- 不会自动选择数据或附件流
### 2.例子
假设存在以下三个输入
```
input file 'A.avi'
      stream 0: video 640x360
      stream 1: audio 2 channels

input file 'B.mp4'
      stream 0: video 1920x1080
      stream 1: audio 2 channels
      stream 2: subtitles (text)
      stream 3: audio 5.1 channels
      stream 4: subtitles (text)

input file 'C.mkv'
      stream 0: video 1280x720
      stream 1: audio 2 channels
      stream 2: subtitles (image)
```
#### 2.1 自动流选择
```shell
ffmpeg -i A.avi -i B.mp4 out1.mkv out2.wav -map 1:a -c:a copy out3.mov
```
指定了三个输出文件，前两个没有`-map`设置任何选项，所以 ffmpeg 会自动为这两个文件选择流
- out1.mkv是一个 Matroska 容器文件并接受视频、音频和字幕流，因此 ffmpeg 将尝试从每种类型中选择一种  
	- 对于视频，选择B.mp4的`stream 0`，在所有输入视频流中具有最高分辨率
	- 对于音频，选择B.mp4的`stream 3`, 因为它有最多的channel
	- 对于字幕，选择B.mp4的`stream 2`, 这是A.avi和B.mp4中第一个字幕流视频文件
- out2.wav只接受音频流，所以只B.mp4的`stream 3`被选中
- out3.mov，因为设置了一个`-map`选项，所以不会发生自动流选择。该`-map 1:a`选项将从B.mp4选择所有音频流，此输出文件中不会包含其他流

对于前两个输出，所有包含的流都将被转码。选择的编码器将是每个输出格式注册的默认编码器，它可能与所选输入流的编解码器不匹配

对于第三个输出，音频流的编解码器选项已设置为`copy`，因此不会发生解码-过滤-编码操作。所选流的数据包应从输入文件中传送并在输出文件中进行多路复用
#### 2.2 自动字幕选择
```shell
ffmpeg -i C.mkv out1.mkv -c:s dvdsub -an out2.mkv
```
- 虽然out1.mkv是接受字幕流的 Matroska 容器文件，但是只会选择视频和音频流。C.mkv字幕流是基于图像的，而 Matroska 多路复用器的默认字幕编码器是基于文本的，因此字幕的转码操作预计会失败，改字幕流不会被选中
- out2.mkv在命令中指定了字幕编码器，所以不仅选择了视频流也选择了字幕流，因为指定了`-an`，所以不会选择音频流
#### 2.3 未标记的过滤图
```shell
ffmpeg -i A.avi -i C.mkv -i B.mp4 -filter_complex "overlay" out1.mp4 out2.srt
```
- 这里设置了过滤器，`overlay`过滤器恰好需要两个视频输入，但没有指定，因此使用前两个可用的视频流，因为过滤器的输出没有标签，因此发送到第一个输出out1.mp4，out1.mp4的音频流自动选择B.mp4的stream3，不会选择字幕流，因为MP4 格式没有注册默认的字幕编码器，并且用户没有指定字幕编码器
- out2.srt只接受基于文本的字幕流，所以会跳过第一个字幕流（C.mkv的stream2），选择B.mp4的stream2（第一个基本文本的字幕流）
#### 2.4 标记的过滤图
```shell
ffmpeg -i A.avi -i B.mp4 -i C.mkv -filter_complex "[1:v]hue=s=0,split=2[outv1][outv2];overlay;aresample" \
        -map '[outv1]' -an        out1.mp4 \
                                  out2.mkv \
        -map '[outv2]' -map 1:a:0 out3.mkv
```
- B.mp4的视频流被送到hue过滤器，然后通过split过滤器被克隆一次，生成outv1和outv2，输出到out1.mp4和out3.mkv中
- overlay过滤器使用前两个没有使用的视频流（来自A.avi和C.mkv），因为没有label，所以输出到out1.mp4中
- aresample过滤器使用第一个未使用的音频流（来自A.avi），因为没有lable，所以输出到out1.mp4中
- out2.mkv完全是自动流选择生成

## 五.选项
### 1.流说明符
- 某些选项适用于每个流，例如比特率或编解码器，流说明符用于精确指定给定选项属于哪个流
- 流说明符是一个字符串，通常附加到选项名称并由冒号分隔。例如`-codec:a:1 ac3`包含 `a:1`流说明符，它匹配第二个音频流。因此，它会为第二个音频流选择 ac3 编解码器
- 流说明符可以匹配多个流，因此该选项适用于所有流。例如，流说明符`-b:a 128k`匹配所有音频流
- 空流说明符匹配所有流。例如，`-codec copy` 或者`-codec: copy`将复制所有流而不重新编码
- 流说明符的可能形式：
	- `stream_index`。例如`-threads:1 4`。将第二个流的线程数设置为4
	- `stream_type[:additional_stream_specifier]`。流类型是以下之一：v或V表示视频，a表示音频，s表示字幕，d表示数据，t表示附件。v匹配所有视频流，V只匹配没有附加图片、视频缩略图或封面艺术的视频流。如果指定了额外的流说明符，那么匹配的流必须要满足该说明符
	- `p:program_id[:additional_stream_specifier]`。匹配程序中具有该程序id的流
	- `#stream_id或i:stream_id`。通过流 ID（例如 MPEG-TS 容器中的 PID）匹配流
	- `m:key[:value]`。匹配具有指定值的元数据标签键的流。如果未给出值，则匹配包含具有任何值的给定标签的流
	- `u`。匹配具有可用配置的流，必须定义编解码器，并且必须存在视频维度或音频采样率等基本信息
### 2.通用选项
- 这些选项在ff系列的工具中通用
- -L，显示许可证
- -h, -?, -help, --help [arg]。arg可能的值如下：
	- long，除了基本工具选项外，还打印高级工具选项
	- full，打印完整的选项列表，包括编码器、解码器、多路分解器、多路复用器、过滤器等的共享和私有选项
	- decoder=decoder_name，打印有关名为decoder_name的解码器的详细信息
	- encoder=encoder_name，打印有关名为encoder_name的编码器的详细信息
	- demuxer=demuxer_name，打印有关名为demuxer_name的解复用器的详细信息
	- muxer=muxer_name，打印有关名为muxer_name的 muxer 的详细信息
	- filter=filter_name，打印有关名为filter_name的过滤器的详细信息
	- bsf=bitstream_filter_name，打印有关名为bitstream_filter_name的比特流过滤器的详细信息
	- protocol=protocol_name，打印有关名为protocol_name的协议的详细信息
- -version，显示版本
- -buildconf，打印构建配置
- -formats，显示可用格式（包括设备）
- -demuxers，显示可用的解复用器
- -muxers，显示可用的复用器
- -devices，显示可用的设备
- -codecs，显示 libavcodec 已知的所有编解码器，术语“编解码器”更准确地说是媒体比特流格式
- -decoders，显示可用的解码器
- -encoders，显示可用的编码器
- -bsfs，显示可用的比特流过滤器
- -protocols，显示可用协议
- -filters，显示可用的 libavfilter 过滤器
- -pix_fmts，显示可用的像素格式
- -sample_fmts，显示可用的采样格式
- -layouts，显示通道名称和标准通道布局
- -dispositions，显示流配置
- -colors，显示可识别的颜色名称
- -sources device\[,opt1=val1\[,opt2=val2\]...]，显示输入设备的自动检测源。某些设备可能会提供无法自动检测的依赖于系统的源名称，不能假设返回的列表总是完整的
- -sinks device\[,opt1=val1\[,opt2=val2\]...\]，显示输出设备的自动检测接收器。某些设备可能会提供无法自动检测的依赖于系统的接收器名称，不能假设返回的列表总是完整的
- -loglevel \[flags+\]loglevel | -v \[flags+\]loglevel。标志可以单独使用，通过添加 +/- 前缀来 设置/重置 单个标志，而不影响其他标志或更改loglevel。当同时设置flags和loglevel时，在最后一个flags值和loglevel之前需要一个+分隔符。可用的flag如下
	- repeat，指示不应将重复的日志输出压缩到第一行，并且将省略"Last message repeated n times"行
	- level，指示日志输出应为每个消息行添加一个`[level]`前缀，loglevel可以包含以下字符串或数字：
		- quiet，-8
		- panic，0
		- fatal，8
		- error，16
		- warning，24
		- info，32
		- verbose，40
		- debug，48
		- trace，56
	- 启用重复日志输出，添加`level`前缀，并将 loglevel设置为`verbose`
	```shell
	ffmpeg -loglevel repeat+level+verbose -i input output
	```
- -report，将完整的命令行和日志输出转储到在当前目录program-YYYYMMDD-HHMMSS.log的文件中。通过设置环境变量FFREPORT有同样的效果，该环境变量识别以下信息：
	- file，设置报告的文件名，%p为程序名，%t为时间戳，\%\%为\%
	- level，使用数值设置详细级别
- -hide_banner，禁止打印每个命令开头的横幅信息
### 3.av选项
av选项由 libavformat、libavdevice 和 libavcodec 库直接提供要查看可用的AVOptions列表，使用-help选项
- generic，用于任何容器、编解码器或设备
- private，用于特定的容器、编解码器或设备
### 4.主要选项
- -f fmt (input/output)，强制输入或输出文件格式通常会自动检测输入文件的格式，并根据输出文件的文件扩展名猜测格式，因此在大多数情况下不需要此选项
- -i url (input)，输入文件地址
- -y (global)，不询问直接覆盖输出文件
- -n (global)，不覆盖输出文件，如果输出文件已经存在，则退出
- -stream_loop number (input)，设置输入流循环的次数，0表示不循环，-1表示无限循环
- -recast_media (global)，强制指定解码器
- -c\[:stream_specifier\] codec (input/output,per-stream)，等同于-codec\[:stream_specifier\] codec (input/output,per-stream)，为一个或多个流选择编码器（在输出文件之前使用时）或解码器（在输入文件之前使用时），当编码器或者解码器使用`copy`时表示流不会被重新编码
	```shell
	# 使用 libx264 编码所有视频流并复制所有音频流
	ffmpeg -i INPUT -map 0 -c:v libx264 -c:a copy OUTPUT
	# 第2个视频流使用libx264编码，第138个音频流使用libvorbis编码，其他的流全部copy
	ffmpeg -i INPUT -map 0 -c copy -c:v:1 libx264 -c:a:137 libvorbis OUTPUT
	```
- -t duration (input/output)，当用作输入选项（`-i`前）时，限制从输入文件读取数据的持续时间，当用作输出选项时（在输出 url 之前），在其持续时间达到duration后停止写入输出。-to 和 -t 互斥，-t 优先
- -to position (input/output)，在position停止写入输出或读取输入
- -fs limit_size (output)，设置文件大小限制，以字节表示，超过限制后不再写入字节块
- -ss position (input/output)，当用作输入选项（`-i`前）时，在此输入文件中seek到postition。当用作输出选项（在输出 url 之前）时，解码但丢弃输入，直到时间戳到达position
- -sseof position (input)，与`-ss`选项类似，但相对于文件结尾
- -isync input_index (input)，将输入分配为同步源
- -itsoffset offset (input)，设置输入时间偏移量
- -itsscale scale (input,per-stream)，重新缩放输入时间戳，scale应该是一个浮点数
- -timestamp date (output)，在容器中设置录制时间戳
- -metadata\[:metadata_specifier\] key=value (output,per-metadata)，设置元数据键/值对
- -disposition\[:stream_specifier\] value (output,per-stream)，设置流的配置
- -program \[title=title:\]\[program_num=program_num:\]st=stream\[:st=stream...\] (output)，创建具有指定title和program_num的程序，并将指定的流添加到其中
- -target type (output)，指定目标文件类型( `vcd`, `svcd`, `dvd`, `dv`, `dv50`)
- -dn (input/output)，作为输入选项，阻止文件的所有数据流被过滤或自动选择或映射到任何输出。作为输出选项，禁用数据记录，即自动选择或映射任何数据流
- -dframes number (output)，设置要输出的数据帧数
- -frames\[:stream_specifier\] framecount (output,per-stream)，在framecount个帧后停止写入流
- -filter\[:stream_specifier\] filtergraph (output,per-stream)，创建指定的filtergraph并使用它来过滤流
- -filter_threads nb_threads (global)，定义用于处理过滤器管道的线程数
- -stats (global)，打印编码进度/统计信息。默认情况下它是打开的，要明确禁用它，需要指定`-nostats`
- -debug_ts (global)，打印时间戳信息，默认关闭
- -attach filename (output)，将附件添加到输出文件
### 5.视频选项
- -vframes number (output)，设置要输出的视频帧数
- -r\[:stream_specifier\] fps (input/output,per-stream)，设置帧速率。作为输入选项，忽略文件中存储的任何时间戳，而是假设恒定帧速率fps生成时间戳。作为输出选项有两种可能：
	- `视频编码`，在编码之前复制或丢弃帧以实现恒定的输出帧速率fps
	- `视频流复制`，向复用器指示fps是流帧速率，这种情况下，不会删除或复制任何数据，如果fps 与数据包时间戳确定的实际流帧速率不匹配，这可能会产生无效文件
- -fpsmax\[:stream_specifier\] fps (output,per-stream)，设置最大帧率，当输出帧率自动设置且高于此值时，钳制输出帧率。不能与`-r`一起设置，在流复制期间被忽略
- -s\[:stream_specifier\] size (input/output,per-stream)，设置帧大小
	- 作为输入选项，这是视频大小私有选项，被一些解复用器识别，其帧大小要么未存储在文件中，要么是可配置的——例如原始视频或视频采集器
	- 作为一个输出选项，这会将`scale`视频过滤器插入到相应过滤器图的末尾，请直接使用`scale`过滤器将其插入开头或其他位置
- -aspect\[:stream_specifier\] aspect (output,per-stream)，设置视频显示纵横比
- -display_rotation\[:stream_specifier\] rotation (input,per-stream)，设置视频旋转元数据
- -display_hflip\[:stream_specifier\] (input,per-stream)，设置视频是否应该水平翻转
- -display_vflip\[:stream_specifier\] (input,per-stream)，设置视频是否应该垂直翻转
- -vn (input/output)，作为输入选项，阻止文件的所有视频流被过滤或自动选择或映射到任何输出。作为输出选项，禁用视频录制，即自动选择或映射任何视频流
- -vcodec codec (output)，等同于`-codec:v`
- -vf filtergraph (output)，等同于-filter:v
- -autorotate，根据文件元数据自动旋转视频，默认启用
- -autoscale，根据第一帧的分辨率自动缩放视频，默认启用
### 6.音频选项
- -aframes number (output)，设置要输出的音频帧数
- -ar\[:stream_specifier\] freq (input/output,per-stream)，设置音频采样频率。对于输出流，它默认设置为相应输入流的频率。对于输入流，此选项仅对音频抓取设备和原始解复用器有意义，并映射到相应的解复用器选项
- -aq q (output)，设置音频质量（特定于编解码器，VBR）。这是-q:a的别名
- -ac\[:stream_specifier\] channels (input/output,per-stream)，设置音频通道数。对于输出流，它默认设置为输入音频通道数。对于输入流，此选项仅对音频抓取设备和原始解复用器有意义，并映射到相应的解复用器选项
- -an (input/output)，作为输入选项，阻止文件的所有音频流被过滤或自动选择或映射到任何输出。作为输出选项，禁用音频录制，即自动选择或映射任何音频流
- -acodec codec (input/output)，设置音频编解码器
- -sample_fmt\[:stream_specifier\] sample_fmt (output,per-stream)，设置音频采样格式
- -af filtergraph (output)，添加音频过滤器
### 7.高级选项
- -map \[-\]input_file_id\[:stream_specifier\]\[?\] | \[linklabel\] (output)，在输出文件中创建一个或多个流。此选项有两种指定数据源的形式：
	- 第一种是从某个输入文件中选择一个或多个流(使用-i选项)
	- 第二种是从复杂的过滤图中获取(`-filter_complex`或者`-filter_complex_script`选项)
```shell
# 映射输入文件中所有的流
ffmpeg -i INPUT -map 0 output
# 选择输入文件中第2个流
ffmpeg -i INPUT -map 0:1 out.wav
# a.mov的第3个流和b.mov的第7个流，拷贝到out.mov
ffmpeg -i a.mov -i b.mov -c copy -map 0:2 -map 1:6 out.mov
# 选择所有视频和第3个音频流
ffmpeg -i INPUT -map 0:v -map 0:a:2 OUTPUT
# 除了第2个音频流，选择其他所有流
ffmpeg -i INPUT -map 0 -map -0:a:1 OUTPUT
# 选择所有视频流，如果没有音频则忽略
ffmpeg -i INPUT -map 0:v -map 0:a? OUTPUT
# 选择英语的音频流
ffmpeg -i INPUT -map 0:m:language:eng OUTPUT
```
## 六.例子
### 1.视频和音频抓取
- 如果指定输入格式和设备，ffmpeg 可以直接抓取视频和音频
	```shell
	ffmpeg -f oss -i /dev/dsp -f video4linux2 -i /dev/video0 /tmp/out.mpg
	```
- 使用 ALSA 音频源（单声道输入，卡 id 1）而不是 OSS
	```shell
	ffmpeg -f alsa -ac 1 -i hw:1 -f video4linux2 -i /dev/video0 /tmp/out.mpg
	```
### 2.x11抓取
- ffmpeg抓取x11，0.0是x11 server的display.screen编号，和DISPLAY环境变量相同
	```shell
	ffmpeg -f x11grab -video_size cif -framerate 25 -i :0.0 /tmp/out.mpg
	```
- 10是x偏移量，20是抓取的y偏移量
	```shell
	ffmpeg -f x11grab -video_size cif -framerate 25 -i :0.0+10,20 /tmp/out.mpg
	```
### 3.视频音频文件格式转换
- 使用yuv文件作为输入，Y 文件使用的分辨率是 U 和 V 文件的两倍。它们是原始数据，没有header。它们可以由所有合理的视频解码器生成。如果ffmpeg无法猜测图片的大小，你必须通过-s选项指定
	```shell
	# 会使用以下文件
	# /tmp/test0.Y, /tmp/test0.U, /tmp/test0.V,
	# /tmp/test1.Y, /tmp/test1.U, /tmp/test1.V ......
	ffmpeg -i /tmp/test%d.Y /tmp/out.mpg
	```
- 从原始的yuv420p文件输入
	```shell
	ffmpeg -i /tmp/test.yuv /tmp/out.avi
	```
- 输出到原始的yuv420p文件
	```shell
	ffmpeg -i mydivx.avi hugefile.yuv
	```
- 将音频文件和原始yuv文件转换成mpeg格式的文件
	```shell
	ffmpeg -i /tmp/a.wav -s 640x480 -i /tmp/a.yuv /tmp/a.mpg
	```
- 以22050 Hz采样率将a.wav转换为MPEG音频
	```shell
	ffmpeg -i /tmp/a.wav -ar 22050 /tmp/a.mp2
	```
- 将 a.wav 转换为 64 kbits 的 a.mp2 和 128 kbits 的 b.mp2
	```shell
	ffmpeg -i /tmp/a.wav -map 0:a -b:a 64k /tmp/a.mp2 -map 0:a -b:a 128k /tmp/b.mp2
	```
- 输入是VOB文件，输出是带有MPEG-4视频和MP3音频的AVI文件。在这个命令中使用b帧，gop大小为300，这意味着对于 29.97fps 输入视频每 10 秒一个I帧
	```shell
	ffmpeg -i snatch_1.vob -f avi -c:v mpeg4 -b:v 800k -g 300 -bf 2 -c:a libmp3lame -b:a 128k snatch.avi
	```
- 从视频中提取图像，这将从视频中每秒提取一个视频帧，并将它们输出到名为foo-001.jpeg,foo-002.jpeg的文件中，图像将重新缩放以适应新的 WxH 值
	```shell
	ffmpeg -i foo.avi -r 1 -s WxH -f image2 foo-%03d.jpeg
	```
- 从图像中创建视频
	```shell
	ffmpeg -f image2 -framerate 12 -i foo-%03d.jpeg -s WxH foo.avi
	```
- 把很多同样类型的流放到输出文件中
	```shell
	ffmpeg -i test1.avi -i test2.avi -map 1:1 -map 1:0 -map 0:1 -map 0:0 -c copy -y test12.nut
	```
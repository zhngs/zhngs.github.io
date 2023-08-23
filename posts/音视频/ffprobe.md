---
date: '2023-03-25'
---

## 一.语法
ffprobe \[options\] input_url
## 二.描述
ffprobe从多媒体流中收集信息并以人类和机器可读的方式打印出来
## 三.选项
### 1.主要选项
- -f format，强制格式
- -unit，显示单位
- -prefix，对显示值使用SI前缀
- -byte_binary_prefix，强制对字节值使用二进制前缀
- -sexagesimal，对时间值使用六十进制格式 HH:MM:SS.MICROSECONDS
- -pretty，美化显示值的格式，对应选项"-unit -prefix -byte_binary_prefix -sexagesimal"
- -of, -print_format writer_name\[=writer_options\]，设置输出打印格式，writer_name指定编写器的名称， writer_options指定要传递给编写器的选项
- -sections，打印section结构和信息，然后退出
- -select_streams stream_specifier，仅选择stream_specifier指定的流
- -show_data，以十六进制和ASCII显示payload数据，和-show_packets配合将打印数据包的数据，和-show_streams配合将转储编解码器额外数据
- -show_data_hash algorithm，显示有效载荷数据的哈希值
- -show_error，显示错误信息
- -show_format，显示有关输入多媒体流的容器格式的信息
- -show_entries section_entries，设置要显示的条目列表
- -show_packets，显示有关输入多媒体流中包含的每个数据包的信息
- -show_frames，显示有关输入多媒体流中包含的每个帧和字幕的信息
- -show_log loglevel，设置日志级别
- -show_streams，显示有关输入多媒体流中包含的每个帧和字幕的信息，每个单帧的信息都打印在名为FRAME或SUBTITLE的专用部分中
- -show_programs，显示有关程序及其包含在输入多媒体流中的流的信息，每个媒体流信息都打印在名为"PROGRAM_STREAM"的专用部分中
- -show_chapters，显示格式存储的章节的信息
- -count_frames，计算每个流的帧数并在相应的流部分中报告
- -count_packets，计算每个流的数据包数量，并在相应的流部分中报告
- -read_intervals read_intervals，只读取指定的时间间隔
- -show_private_data, -private：显示私有数据，取决于特定元素格式显示的数据，默认启用
- -show_program_version，显示与程序版本相关的信息
- -show_library_versions，显示与库版本相关的信息
- -show_versions，显示与程序和库版本相关的信息
- -show_pixel_formats，显示有关FFmpeg支持的所有像素格式的信息
- -show_optional_fields value
- -bitexact，强制 bitexact 输出
- -i input_url，获取输入
- -o output_url，将输出写入output_url
### 2.输出格式
- 默认
- compact，csv
- flat
- ini
- json
- xml
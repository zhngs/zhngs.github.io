---
date: '2023-03-23'
---

## 一.libavformat
### 1.avformat_open_input
打开一个输入流并读取header，编码器并没有打开，需要使用avformat_close_input进行关闭
```c++
int avformat_open_input(AVFormatContext **ps, const char *url,
                        const AVInputFormat *fmt, AVDictionary **options);
```
参数：
- ps：指向用户提供的AVFormatContext(由avformat_alloc_context分配)，可以是一个NULL指针，这种情况下avformat_open_input内部会分配ps的内存。需要注意在函数失败时，用户提供的ps会被释放
- url：要打开的stream路径
- fmt：如果不为NULL，该参数强制指定输入格式，否则自动检测格式
- options：可以为NULL

返回值：
- 0表示成功，失败返回负的AVERROR
### 2.avformat_find_stream_info
读取媒体文件的数据包以获取流信息，这对于没有标头的文件格式(如MPEG)很有用，读取过的数据包可能会被缓存供以后使用
```c++
int avformat_find_stream_info(AVFormatContext *ic, AVDictionary **options);
```
参数：
- ic：媒体文件句柄
- options：可以为NULL

返回值：
- 大于等于0表示成功，AVERROR_xxx表示失败
### 3.av_find_best_stream
找到文件中最符合期望的流
```c++
int av_find_best_stream(AVFormatContext *ic,
                        enum AVMediaType type,
                        int wanted_stream_nb,
                        int related_stream,
                        const AVCodec **decoder_ret,
                        int flags);
```
参数：
- ic：媒体文件句柄
- type：媒体文件类型，如音频，视频，字幕等
- wanted_stream_nb：用户需要stream号，如果是-1则自动选择
- related_stream：尝试找一个相关的流，如果是-1则忽略
- decoder_ret：如果非空，返回选择的流的解码器
- flags：目前未使用

返回值：
- 成功返回非负的stream序号
- AVERROR_STREAM_NOT_FOUND表示找不到相关的流
- AVERROR_DECODER_NOT_FOUND表示找到相关的流，但是没有对应解码器
### 4.av_read_frame
返回流的下一帧
```c++
int av_read_frame(AVFormatContext *s, AVPacket *pkt);
```
参数：
- s：媒体文件句柄
- pkt：内部储存数据的buffer

返回值：
- 0表示成功，小于0表示出错或者文件结束。当出错的时候，pkt会为空，如同来自av_packet_alloc()

注意：
- 当成功的时候，返回的pkt将被引用计数，不再使用的时候必须手动使用av_packet_unref进行释放
- 对于视频，pkt总是包含一帧
- 对于音频，如果每个帧是固定长度(例如PCM或ADPCM)，可能会包含多个帧。如果每个帧是可变大小(例如MPEG音频)，pkt只会包含一个帧
- pkt->pts, pkt->dts和pkt->duration 总是设置成正确的数值，单位使用AVStream.time_base。如果视频包含B帧，pkt->pts可以被设置成AV_NOPTS_VALUE，如果你没有解压数据，最好依赖pkt->dts
### 5.avcodec_send_packet
为解码器提供原始的数据包
```c++
int avcodec_send_packet(AVCodecContext *avctx, const AVPacket *avpkt);
```
参数：
- avctx：编解码上下文
- avpkt：通常这是一个视频帧或多个音频帧，avpkt的所有权属于调用者，解码器不会向avpkt中写入数据，但是可能会创建引用计数或者拷贝avpkt。avpkt总会被消耗完，必须多次调用avcodec_receive_frame后，才能重新调用avcodec_send_packet。avpkt可以为NULL(或者pkt内部的data为NULL，并且size为0)，在这种情况下，avpkt会被认为是一个flush packet来标记流的结尾，第一次发送flush packet会返回成功，后续会返回AVERROR_EOF。如果解码器有帧缓存，在收到flush packet的时候会返回这些帧

返回值：
- 0表示成功
- AVERROR(EAGAIN)：当前状态不接受输入，用户必须通过avcodec_receive_frame读取输出
- AVERROR_EOF：解码器已经被flush，不再接受新的packet
- AVERROR(EINVAL)：解码器未打开，或者是编码器，或者需要flush
- AVERROR(ENOMEM)：向内部对列添加包失败，或者解码失败
### 6.avcodec_receive_frame
返回解码器的解码输出
```c++
int avcodec_receive_frame(AVCodecContext *avctx, AVFrame *frame);
```
参数：
- avctx：编解码上下文
- frame：解码器会分配引用计数的视频或音频frame，需要注意该函数开始的时候总会调用av_frame_unref(frame) 

返回值：
- 0表示成功
- AVERROR(EAGAIN)：当前状态已经读完所有输出，需要向解码器发送新的输入
- AVERROR_EOF：解码器已经被flush，不会再有新的输出
- AVERROR(EINVAL)：解码器没有打开，或者是一个编码器
- AVERROR_INPUT_CHANGED：相对于第一个解码帧，当前的解码帧已经改变参数
### 7.av_parser_parse2
解析一个packet
```c++
int av_parser_parse2(AVCodecParserContext *s,
                     AVCodecContext *avctx,
                     uint8_t **poutbuf, int *poutbuf_size,
                     const uint8_t *buf, int buf_size,
                     int64_t pts, int64_t dts,
                     int64_t pos);
```
参数：
- s：parser上下文
- avctx：编解码器上下文
- poutbuf：设置parsed缓冲区的指针，如果未完成则设置为NULL
- poutbuf_size：设置parsed缓冲区的大小，如果未完成设置为0
- buf：输入buf
- buf_size：不包括padding大小的buf大小。为了表示EOF，应该设置为0
- pts：显示时间戳
- dts：解码时间戳
- pos：在stream中的输入字节位置

返回值：
- 输入比特流用到的字节数
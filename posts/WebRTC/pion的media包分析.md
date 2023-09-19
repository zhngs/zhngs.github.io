---
date: '2023-03-26'
---
### 1.media包

pion的media包有两个数据结构，目前支持h264、ogg、ivf读写

```go
// A Sample contains encoded media and timing information
type Sample struct {
	Data               []byte
	Timestamp          time.Time
	Duration           time.Duration
	PacketTimestamp    uint32
	PrevDroppedPackets uint16
	Metadata           interface{}
}

// Writer defines an interface to handle
// the creation of media files
type Writer interface {
	// Add the content of an RTP packet to the media
	WriteRTP(packet *rtp.Packet) error
	// Close the media
	// Note: Close implementation must be idempotent
	Close() error
}
```

### 2.H264Reader

H264Reader开放了两个接口，NewReader和NextNAL。NewReader会传入一个io.Reader，用作数据的来源。NextNAL会解析出下一个NALU。

- H264Reader.read会封底内部buffer的读写
- bitStreamStartsWithH264Prefix会判断第一个StartCode的类型，并且只会使用一次
- processByte会在后续持续使用，每次判断一个字节，目的是用来找到下一个StartCode，从而给出NALU

### 3.H264Writer

h264和rtp RFC文档：https://tools.ietf.org/html/rfc6184，H264Writer的核心函数是WriteRTP，会先判断关键帧，再将rtp的payload转换成h264数据

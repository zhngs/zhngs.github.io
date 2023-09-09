---
date: '2023-09-05'
---
### 1.sdp类型

- sdp有Plan B和Unified Plan两种，Unified Plan比Plan B更灵活，Plan B在目前的chrome中已经被废除
- Plan B, 仅支持一条音频m line, 和一条视频m line, 音频和视频的媒体流的标识（mid）分别被设置成audio和video。如果同个媒体包括多个发送流，那么在mline下，可以列出多行a=ssrc属性
- Unified Plan, 一个m line表示一个发送或者接收流，每条m line都可以独立标识mid; 如果存在多个流，那么可以创建出多个条mline
- Plan B和Unified Plan的判断方式是，如果多个track的mid相同，则是Plan B。如果只有一个ssrc，无法判断是Unified Plan和Plan B

### 2.sdp数据类型

pion会将字符串类型的sdp解析成SessionDescription结构，最主要的是MediaDescription中的Attribute列表，然后通过字符串匹配来确定具体的属性

```go
// SessionDescription is a a well-defined format for conveying sufficient
// information to discover and participate in a multimedia session.
type SessionDescription struct {
	// v=0
	// https://tools.ietf.org/html/rfc4566#section-5.1
	Version Version

	// o=<username> <sess-id> <sess-version> <nettype> <addrtype> <unicast-address>
	// https://tools.ietf.org/html/rfc4566#section-5.2
	Origin Origin

	// s=<session name>
	// https://tools.ietf.org/html/rfc4566#section-5.3
	SessionName SessionName

	// i=<session description>
	// https://tools.ietf.org/html/rfc4566#section-5.4
	SessionInformation *Information

	// u=<uri>
	// https://tools.ietf.org/html/rfc4566#section-5.5
	URI *url.URL

	// e=<email-address>
	// https://tools.ietf.org/html/rfc4566#section-5.6
	EmailAddress *EmailAddress

	// p=<phone-number>
	// https://tools.ietf.org/html/rfc4566#section-5.6
	PhoneNumber *PhoneNumber

	// c=<nettype> <addrtype> <connection-address>
	// https://tools.ietf.org/html/rfc4566#section-5.7
	ConnectionInformation *ConnectionInformation

	// b=<bwtype>:<bandwidth>
	// https://tools.ietf.org/html/rfc4566#section-5.8
	Bandwidth []Bandwidth

	// https://tools.ietf.org/html/rfc4566#section-5.9
	// https://tools.ietf.org/html/rfc4566#section-5.10
	TimeDescriptions []TimeDescription

	// z=<adjustment time> <offset> <adjustment time> <offset> ...
	// https://tools.ietf.org/html/rfc4566#section-5.11
	TimeZones []TimeZone

	// k=<method>
	// k=<method>:<encryption key>
	// https://tools.ietf.org/html/rfc4566#section-5.12
	EncryptionKey *EncryptionKey

	// a=<attribute>
	// a=<attribute>:<value>
	// https://tools.ietf.org/html/rfc4566#section-5.13
	Attributes []Attribute

	// https://tools.ietf.org/html/rfc4566#section-5.14
	MediaDescriptions []*MediaDescription
}

// MediaDescription represents a media type.
// https://tools.ietf.org/html/rfc4566#section-5.14
type MediaDescription struct {
	// m=<media> <port>/<number of ports> <proto> <fmt> ...
	// https://tools.ietf.org/html/rfc4566#section-5.14
	MediaName MediaName

	// i=<session description>
	// https://tools.ietf.org/html/rfc4566#section-5.4
	MediaTitle *Information

	// c=<nettype> <addrtype> <connection-address>
	// https://tools.ietf.org/html/rfc4566#section-5.7
	ConnectionInformation *ConnectionInformation

	// b=<bwtype>:<bandwidth>
	// https://tools.ietf.org/html/rfc4566#section-5.8
	Bandwidth []Bandwidth

	// k=<method>
	// k=<method>:<encryption key>
	// https://tools.ietf.org/html/rfc4566#section-5.12
	EncryptionKey *EncryptionKey

	// a=<attribute>
	// a=<attribute>:<value>
	// https://tools.ietf.org/html/rfc4566#section-5.13
	Attributes []Attribute
}
```

### 3.媒体行解析

媒体行是以 `m=`开头的行，是媒体信息的一个大纲，pion会遍历Formats字段，拿到所有codec的payload，然后根据下文补充codec信息

```go
// m=<media> <port>/<number of ports> <proto> <fmt> ...
// m=audio 9 UDP/TLS/RTP/SAVPF 111 63 9 0 8 110 126
type MediaName struct {
	Media   string // audio
	Port    RangedPort // 9
	Protos  []string // {UDP, TLS, RTP, SAVPF}
	Formats []string // {111, 63, 9, 0, 8, 110, 126}
}
```

### 4.codec解析

payload和rtpmap、fmtp、rtcp-fb联系起来，构成codec信息

```go
//a=rtpmap:111 opus/48000/2
//a=rtcp-fb:111 transport-cc
//a=fmtp:111 minptime=10;useinbandfec=1

type Codec struct {
	PayloadType        uint8 // 111
	Name               string // opus
	ClockRate          uint32 // 48000
	EncodingParameters string // 2
	Fmtp               string // minptime=10;useinbandfec=1
	RTCPFeedback       []string // {transport-cc}
}

// rtcp feedback可进一步解析成如下两个字段
type RTCPFeedback struct {
	// Type is the type of feedback.
	// see: https://draft.ortc.org/#dom-rtcrtcpfeedback
	// valid: ack, ccm, nack, goog-remb, transport-cc
	Type string

	// The parameter value depends on the type.
	// For example, type="nack" parameter="pli" will send Picture Loss Indicator packets.
	Parameter string
}
```

rtp拓展头信息解析extmap

```go
// a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
type ExtMap struct {
	Value     int // 2
	Direction Direction
	URI       *url.URL // http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
	ExtAttr   *string
}
```

最终可以获得如下结构

```go
type RTPParameters struct {
	HeaderExtensions []RTPHeaderExtensionParameter
	Codecs           []RTPCodecParameters
}

type RTPCodecParameters struct {
	RTPCodecCapability
	PayloadType PayloadType

	statsID string
}

type RTPCodecCapability struct {
	MimeType     string // audio/opus 或者 video/h264
	ClockRate    uint32
	Channels     uint16
	SDPFmtpLine  string
	RTCPFeedback []RTCPFeedback
}

type RTPHeaderExtensionParameter struct {
	URI string
	ID  int
}
```

### 5.匹配media engine中的codec

- sdp协商媒体在于将offer和answer中的交集提取出来，媒体匹配就是MimeType和SDPFmtpLine，以及rtp拓展头进行匹配
- 最终会在MediaEngine的negotiatedVideoCodecs、negotiatedAudioCodecs、negotiatedHeaderExtensions保留协商的记录

### 6.解析track

通过mid、msid、ssrc等属性可以将track的信息解析出来

```go
// a=mid:midvalue 例子如下
// a=mid:0

// a=msid:<stream_id> <track_label> 例子如下
// a=msid:5c145797-3a5e-49ea-85e0-c287db52556f 03d5a55b-0040-4458-854e-8ccec10fd17e

// a=ssrc-group:FID base-ssrc rtx-ssrc 例子如下
// a=ssrc-group:FID 3362759721 24512932

// a=ssrc:3362759721 msid:streamid trackid 例子如下
// a=ssrc:3362759721 msid:5c145797-3a5e-49ea-85e0-c287db52556f 1babb4b9-0c67-4aa9-b77c-73d1a62039e9

type trackDetails struct {
	mid        string
	kind       RTPCodecType
	streamID   string
	id         string
	ssrcs      []SSRC
	repairSsrc *SSRC
	rids       []string
}
```

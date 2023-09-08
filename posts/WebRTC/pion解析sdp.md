---
date: '2023-09-05'
---
### 1.sdp类型

- sdp有Plan B和Unified Plan两种，Unified Plan比Plan B更灵活，Plan B在目前的chrome中已经被废除
- Plan B, 仅支持一条音频m line, 和一条视频m line, 音频和视频的媒体流的标识（mid）分别被设置成audio和video。如果同个媒体包括多个发送流，那么在mline下，可以列出多行a=ssrc属性
- Unified Plan, 一个m line表示一个发送或者接收流，每条m line都可以独立标识mid; 如果存在多个流，那么可以创建出多个条mline
- Plan B和Unified Plan的判断方式是，如果多个track的mid相同，则是Plan B。如果只有一个ssrc，无法判断是Unified Plan和Plan B

```go
v=0
o=- 9004898256777827180 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0 1
a=extmap-allow-mixed
a=msid-semantic: WMS 5c145797-3a5e-49ea-85e0-c287db52556f
m=audio 63821 UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126
c=IN IP4 192.168.1.5
a=rtcp:9 IN IP4 0.0.0.0
a=candidate:365075468 1 udp 2122194687 192.168.1.5 63821 typ host generation 0 network-id 1 network-cost 10
a=candidate:422532441 1 udp 2122262783 2408:8207:1915:b380:3172:19d9:937a:13e2 64021 typ host generation 0 network-id 2 network-cost 10
a=candidate:3949480088 1 tcp 1518214911 192.168.1.5 9 typ host tcptype active generation 0 network-id 1 network-cost 10
a=candidate:3884286413 1 tcp 1518283007 2408:8207:1915:b380:3172:19d9:937a:13e2 9 typ host tcptype active generation 0 network-id 2 network-cost 10
a=ice-ufrag:sEDf
a=ice-pwd:pZrpqVNMJvvoN4UtVUVQXwIp
a=ice-options:trickle
a=fingerprint:sha-256 5E:23:41:61:E6:D5:6F:0A:8D:8A:7C:6F:91:0A:F8:57:93:DA:93:5D:1B:E1:17:48:F6:E2:27:12:E1:49:35:FB
a=setup:actpass
a=mid:0
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid
a=sendrecv
a=msid:5c145797-3a5e-49ea-85e0-c287db52556f 03d5a55b-0040-4458-854e-8ccec10fd17e
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
a=rtpmap:63 red/48000/2
a=fmtp:63 111/111
a=rtpmap:9 G722/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:13 CN/8000
a=rtpmap:110 telephone-event/48000
a=rtpmap:126 telephone-event/8000
a=ssrc:380028089 cname:H+NaotmKEAzCTHZk
a=ssrc:380028089 msid:5c145797-3a5e-49ea-85e0-c287db52556f 03d5a55b-0040-4458-854e-8ccec10fd17e
m=video 61937 UDP/TLS/RTP/SAVPF 96 97 102 103 104 105 106 107 108 109 127 125 39 40 45 46 98 99 100 101 112 113 116 117 118
c=IN IP4 192.168.1.5
a=rtcp:9 IN IP4 0.0.0.0
a=candidate:365075468 1 udp 2122194687 192.168.1.5 61937 typ host generation 0 network-id 1 network-cost 10
a=candidate:422532441 1 udp 2122262783 2408:8207:1915:b380:3172:19d9:937a:13e2 61439 typ host generation 0 network-id 2 network-cost 10
a=candidate:3949480088 1 tcp 1518214911 192.168.1.5 9 typ host tcptype active generation 0 network-id 1 network-cost 10
a=candidate:3884286413 1 tcp 1518283007 2408:8207:1915:b380:3172:19d9:937a:13e2 9 typ host tcptype active generation 0 network-id 2 network-cost 10
a=ice-ufrag:sEDf
a=ice-pwd:pZrpqVNMJvvoN4UtVUVQXwIp
a=ice-options:trickle
a=fingerprint:sha-256 5E:23:41:61:E6:D5:6F:0A:8D:8A:7C:6F:91:0A:F8:57:93:DA:93:5D:1B:E1:17:48:F6:E2:27:12:E1:49:35:FB
a=setup:actpass
a=mid:1
a=extmap:14 urn:ietf:params:rtp-hdrext:toffset
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:13 urn:3gpp:video-orientation
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type
a=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing
a=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space
a=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id
a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id
a=sendrecv
a=msid:5c145797-3a5e-49ea-85e0-c287db52556f 1babb4b9-0c67-4aa9-b77c-73d1a62039e9
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=96
a=rtpmap:102 H264/90000
a=rtcp-fb:102 goog-remb
a=rtcp-fb:102 transport-cc
a=rtcp-fb:102 ccm fir
a=rtcp-fb:102 nack
a=rtcp-fb:102 nack pli
a=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f
a=rtpmap:103 rtx/90000
a=fmtp:103 apt=102
a=rtpmap:104 H264/90000
a=rtcp-fb:104 goog-remb
a=rtcp-fb:104 transport-cc
a=rtcp-fb:104 ccm fir
a=rtcp-fb:104 nack
a=rtcp-fb:104 nack pli
a=fmtp:104 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f
a=rtpmap:105 rtx/90000
a=fmtp:105 apt=104
a=rtpmap:106 H264/90000
a=rtcp-fb:106 goog-remb
a=rtcp-fb:106 transport-cc
a=rtcp-fb:106 ccm fir
a=rtcp-fb:106 nack
a=rtcp-fb:106 nack pli
a=fmtp:106 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f
a=rtpmap:107 rtx/90000
a=fmtp:107 apt=106
a=rtpmap:108 H264/90000
a=rtcp-fb:108 goog-remb
a=rtcp-fb:108 transport-cc
a=rtcp-fb:108 ccm fir
a=rtcp-fb:108 nack
a=rtcp-fb:108 nack pli
a=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f
a=rtpmap:109 rtx/90000
a=fmtp:109 apt=108
a=rtpmap:127 H264/90000
a=rtcp-fb:127 goog-remb
a=rtcp-fb:127 transport-cc
a=rtcp-fb:127 ccm fir
a=rtcp-fb:127 nack
a=rtcp-fb:127 nack pli
a=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f
a=rtpmap:125 rtx/90000
a=fmtp:125 apt=127
a=rtpmap:39 H264/90000
a=rtcp-fb:39 goog-remb
a=rtcp-fb:39 transport-cc
a=rtcp-fb:39 ccm fir
a=rtcp-fb:39 nack
a=rtcp-fb:39 nack pli
a=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f
a=rtpmap:40 rtx/90000
a=fmtp:40 apt=39
a=rtpmap:45 AV1/90000
a=rtcp-fb:45 goog-remb
a=rtcp-fb:45 transport-cc
a=rtcp-fb:45 ccm fir
a=rtcp-fb:45 nack
a=rtcp-fb:45 nack pli
a=rtpmap:46 rtx/90000
a=fmtp:46 apt=45
a=rtpmap:98 VP9/90000
a=rtcp-fb:98 goog-remb
a=rtcp-fb:98 transport-cc
a=rtcp-fb:98 ccm fir
a=rtcp-fb:98 nack
a=rtcp-fb:98 nack pli
a=fmtp:98 profile-id=0
a=rtpmap:99 rtx/90000
a=fmtp:99 apt=98
a=rtpmap:100 VP9/90000
a=rtcp-fb:100 goog-remb
a=rtcp-fb:100 transport-cc
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 nack pli
a=fmtp:100 profile-id=2
a=rtpmap:101 rtx/90000
a=fmtp:101 apt=100
a=rtpmap:112 H264/90000
a=rtcp-fb:112 goog-remb
a=rtcp-fb:112 transport-cc
a=rtcp-fb:112 ccm fir
a=rtcp-fb:112 nack
a=rtcp-fb:112 nack pli
a=fmtp:112 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f
a=rtpmap:113 rtx/90000
a=fmtp:113 apt=112
a=rtpmap:116 red/90000
a=rtpmap:117 rtx/90000
a=fmtp:117 apt=116
a=rtpmap:118 ulpfec/90000
a=ssrc-group:FID 3362759721 24512932
a=ssrc:3362759721 cname:H+NaotmKEAzCTHZk
a=ssrc:3362759721 msid:5c145797-3a5e-49ea-85e0-c287db52556f 1babb4b9-0c67-4aa9-b77c-73d1a62039e9
a=ssrc:24512932 cname:H+NaotmKEAzCTHZk
a=ssrc:24512932 msid:5c145797-3a5e-49ea-85e0-c287db52556f 1babb4b9-0c67-4aa9-b77c-73d1a62039e9
```

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

---
date: '2023-09-02'
---
### 1.pion中拦截器作用

pion中拦截器可以改变媒体行为，如nack拦截器，原理是在数据流程中加了一次hook

```go
// Interceptor can be used to add functionality to you PeerConnections by modifying any incoming/outgoing rtp/rtcp
// packets, or sending your own packets as needed.
type Interceptor interface {
	// BindRTCPReader lets you modify any incoming RTCP packets. It is called once per sender/receiver, however this might
	// change in the future. The returned method will be called once per packet batch.
	BindRTCPReader(reader RTCPReader) RTCPReader

	// BindRTCPWriter lets you modify any outgoing RTCP packets. It is called once per PeerConnection. The returned method
	// will be called once per packet batch.
	BindRTCPWriter(writer RTCPWriter) RTCPWriter

	// BindLocalStream lets you modify any outgoing RTP packets. It is called once for per LocalStream. The returned method
	// will be called once per rtp packet.
	BindLocalStream(info *StreamInfo, writer RTPWriter) RTPWriter

	// UnbindLocalStream is called when the Stream is removed. It can be used to clean up any data related to that track.
	UnbindLocalStream(info *StreamInfo)

	// BindRemoteStream lets you modify any incoming RTP packets. It is called once for per RemoteStream. The returned method
	// will be called once per rtp packet.
	BindRemoteStream(info *StreamInfo, reader RTPReader) RTPReader

	// UnbindRemoteStream is called when the Stream is removed. It can be used to clean up any data related to that track.
	UnbindRemoteStream(info *StreamInfo)

	io.Closer
}
```

### 2.拦截器使用流程

- DtlsTransport的streamsForSSRC方法会调用拦截器的BindRemoteStream和BindRTCPReader
- API的NewPeerConnection方法会调用拦截器的BindRTCPWriter
- PeerConnection的handleIncomingSSRC方法会调用拦截器的UnbindRemoteStream
- PeerConnection的Close方法会调用拦截器的Close
- RTPReceiver的Stop方法会调用拦截器的UnbindRemoteStream
- RTPSender的addEncoding方法会调用拦截器的BindRTCPReader
- RTPSender的Send方法会调用拦截器的BindLocalStream
- RTPSender的Stop方法会调用拦截器的UnbindLocalStream

### 3.拦截器结构位置

- PeerConnection中存在一个interceptorRTCPWriter，可以用来写rtcp包

  ```go
  // WriteRTCP sends a user provided RTCP packet to the connected peer. If no peer is connected the
  // packet is discarded. It also runs any configured interceptors.
  func (pc *PeerConnection) WriteRTCP(pkts []rtcp.Packet) error {
  	_, err := pc.interceptorRTCPWriter.Write(pkts, make(interceptor.Attributes))
  	return err
  }
  ```
- RTPRReceiver的tracks数组中有interceptor.RTPReader和interceptor.RTCPReader，主要用来ReadRTP和ReadRTCP
- RTPSender的trackEncodings数组中有rtcpInterceptor，主要用来ReadRTCP

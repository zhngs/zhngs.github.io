---
date: '2023-09-10'
---

### 1.存储位置
peerconnection有rtpTransceivers字段，该字段是一个RTPTransceiver切片，本地track和远端track最终都在这个切片里面。那么如何区别切片的成员是来自本地还是来自远端？一个transceiver内部包含一个RTPSender指针和一个RTPReceiver指针，RTPSender来自本地，RTPReceiver来自远端

### 2.本地track
本地track在RTPSender的trackEncoding切片中，通过peerconnection的AddTrack方法来添加

```go
type trackEncoding struct {
	track TrackLocal

	srtpStream *srtpWriterFuture

	rtcpInterceptor interceptor.RTCPReader
	streamInfo      interceptor.StreamInfo

	context *baseTrackLocalContext

	ssrc SSRC
}

// TrackLocal is an interface that controls how the user can send media
// The user can provide their own TrackLocal implementations, or use
// the implementations in pkg/media
type TrackLocal interface {
	// Bind should implement the way how the media data flows from the Track to the PeerConnection
	// This will be called internally after signaling is complete and the list of available
	// codecs has been determined
	Bind(TrackLocalContext) (RTPCodecParameters, error)

	// Unbind should implement the teardown logic when the track is no longer needed. This happens
	// because a track has been stopped.
	Unbind(TrackLocalContext) error

	// ID is the unique identifier for this Track. This should be unique for the
	// stream, but doesn't have to globally unique. A common example would be 'audio' or 'video'
	// and StreamID would be 'desktop' or 'webcam'
	ID() string

	// RID is the RTP Stream ID for this track.
	RID() string

	// StreamID is the group this track belongs too. This must be unique
	StreamID() string

	// Kind controls if this TrackLocal is audio or video
	Kind() RTPCodecType
}
```

### 3.远端track
远端track在RTPReceiver中的tracks切片中，通过SetRemoteDescription来填充该字段

```go
// trackStreams maintains a mapping of RTP/RTCP streams to a specific track
// a RTPReceiver may contain multiple streams if we are dealing with Simulcast
type trackStreams struct {
	track *TrackRemote

	streamInfo, repairStreamInfo *interceptor.StreamInfo

	rtpReadStream  *srtp.ReadStreamSRTP
	rtpInterceptor interceptor.RTPReader

	rtcpReadStream  *srtp.ReadStreamSRTCP
	rtcpInterceptor interceptor.RTCPReader

	repairReadStream  *srtp.ReadStreamSRTP
	repairInterceptor interceptor.RTPReader

	repairRtcpReadStream  *srtp.ReadStreamSRTCP
	repairRtcpInterceptor interceptor.RTCPReader
}

// TrackRemote represents a single inbound source of media
type TrackRemote struct {
	mu sync.RWMutex

	id       string
	streamID string

	payloadType PayloadType
	kind        RTPCodecType
	ssrc        SSRC
	codec       RTPCodecParameters
	params      RTPParameters
	rid         string

	receiver         *RTPReceiver
	peeked           []byte
	peekedAttributes interceptor.Attributes
}
```
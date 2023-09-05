---
date: '2023-09-04'
---
https://www.w3.org/TR/webrtc-stats/

### 1.stats

stats的主要作用是统计pc的各种信息，有助于理解一个会话中发生了什么和发生的原因

### 2.用法

- 首先要在拦截器中注册一个状态工厂，该状态工厂的OnNewPeerConnection可以在pc创建的时候拿到stats.Getter
- 在pc中的Ontrack回调里通过stats.Getter可以拿到一个具体track的stats信息

```go
i := &interceptor.Registry{}
statsInterceptorFactory, err := stats.NewInterceptor()
if err != nil {
    panic(err)
}

var statsGetter stats.Getter
statsInterceptorFactory.OnNewPeerConnection(func(_ string, g stats.Getter) {
    statsGetter = g
})
i.Add(statsInterceptorFactory)

peerConnection.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
    fmt.Printf("New incoming track with codec: %s\n", track.Codec().MimeType)

    go func() {
	for {
	    stats := statsGetter.Get(uint32(track.SSRC()))

	    fmt.Printf("Stats for: %s\n", track.Codec().MimeType)
	    fmt.Println(stats.InboundRTPStreamStats)

	    time.Sleep(time.Second * 5)
	}
    }()

//......
})

// output
InboundRTPStreamStats:
        PacketsReceived: 22180
        PacketsLost: 0
        Jitter: 388.0068004389309
        LastPacketReceivedTimestamp: 2023-09-04 13:29:27.264265 +0800 CST m=+125.032193679
        HeaderBytesReceived: 443600
        BytesReceived: 24424463
        FIRCount: 0
        PLICount: 0
        NACKCount: 0
OutboundRTPStreamStats
        PacketsSent: 0
        BytesSent: 0
        HeaderBytesSent: 0
        NACKCount: 0
        FIRCount: 0
        PLICount: 0
RemoteInboundRTPStreamStats:
        PacketsReceived: 0
        PacketsLost: 0
        Jitter: 0
        RoundTripTime: 0s
        TotalRoundTripTime: 0s
        FractionLost: 0
        RoundTripTimeMeasurements: 0
RemoteOutboundRTPStreamStats:
        PacketsSent: 0
        BytesSent: 0
        RemoteTimeStamp: 0001-01-01 00:00:00 +0000 UTC
        ReportsSent: 0
        RoundTripTime: 0s
        TotalRoundTripTime: 0s
        RoundTripTimeMeasurements: 0
```

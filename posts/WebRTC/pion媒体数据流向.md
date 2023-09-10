---
date: '2023-09-01'
---
### 1.onTrack分析

pion的onTrack回调可以拿到remote track

- PeerConnection的startReceiver和handleIncomingSSRC方法会回调onTrack
- handleIncomingSSRC函数是用来处理未在sdp中声明的ssrc
- startReceiver会利用sdp中解析出来的trackDetail，调用RTPReceiver的startReceive，startReceive会从dtlsTransport中拿到rtpReadStream、rtpInterceptor、rtcpReadStream、rtcpInterceptor，给RTPReceiver中的track赋值。对于rtx track，pion没有暴露给使用者，而是在函数中单独起了一个协程来读取

### 2.媒体启动流程

- DtlsTransport的startSRTP会调用NewSessionSRTP和NewSessionSRTCP，并把从ice那里拿到的多路复用的socket结构传入进去
- 最终会调用srtp包中的session.start方法，核心拿到数据的逻辑是在一个协程的for循环中，读多路复用的socket，并执行传入的session接口的decrypt方法

  ```go
  go func() {
  	defer func() {
  		close(s.newStream)

  		s.readStreamsLock.Lock()
  		s.readStreamsClosed = true
  		s.readStreamsLock.Unlock()
  		close(s.closed)
  	}()

  	b := make([]byte, 8192)
  	for {
  		var i int
  		i, err = s.nextConn.Read(b)
  		if err != nil {
  			if !errors.Is(err, io.EOF) {
  				s.log.Error(err.Error())
  			}
  			return
  		}

  		if err = child.decrypt(b[:i]); err != nil {
  			s.log.Info(err.Error())
  		}
  	}
  }()
  ```
- decrypt方法会将新的stream通过chan传给AcceptStream函数，并最终被上层应用回调拿到stream

### 3.媒体数据流向的本质

在pion接收或发送媒体数据需要理解如下条件
- 有一个可用的local-remote candidate对，stun、dtls包可以从中拿到，媒体包可以通过回调分发到上层
- 要清楚sdp和pc的关系，sdp交换是主要是为了协商两端的媒体信息，所以一个pc对应一个local sdp和一个remote sdp
- pc和stream的关系，一个pc对应一个stream，一个stream有多个track，对于Unified Plan，一个m line就是一个track，一个track和一个ssrc唯一对应，这里track也有可能会有重传ssrc。这里需要明确m line是可以不带track信息的，此时只有codec信息
- pion中peerconnection的结构中有RTPTransceiver数组，一个RTPTransceiver和一个mid对应，RTPTransceiver包含一个RTPSender和RTPReceiver，两者中都有track列表。对于Unified Plan来说，一个mid只有一个track，此时RTPTRansciever实际只对应一个track；对于Plan B来说，一个mid可以有多个track，此时RTPSender和RTPReceiver中都track列表就可以起到作用
- 正式开启媒体交互需要三个函数，pc.startRTPSenders，pc.configureRTPReceivers，startRTP。startRTPSenders的作用是配置媒体发送的数据结构，configureRTPReceivers的作用是配置媒体接收的数据结构，startRTP正式开启媒体发送和接收流程
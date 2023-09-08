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

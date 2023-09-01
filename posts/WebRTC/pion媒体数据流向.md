---
date: '2023-09-01'
---
### 1.onTrack分析

pion的onTrack回调可以拿到remote track

- PeerConnection的startReceiver和handleIncomingSSRC方法会回调onTrack
- startRtp是上述两个方法的入口

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

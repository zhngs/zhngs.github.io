---
date: '2023-08-31'
---
### 1.pion状态

- pion的连接状态如下

  ```go
  // peerconnection的状态
  const (
  	peerConnectionStateNewStr          = "new"
  	peerConnectionStateConnectingStr   = "connecting"
  	peerConnectionStateConnectedStr    = "connected"
  	peerConnectionStateDisconnectedStr = "disconnected"
  	peerConnectionStateFailedStr       = "failed"
  	peerConnectionStateClosedStr       = "closed"
  )

  // ice的状态
  const (
  	iceConnectionStateNewStr          = "new"
  	iceConnectionStateCheckingStr     = "checking"
  	iceConnectionStateConnectedStr    = "connected"
  	iceConnectionStateCompletedStr    = "completed"
  	iceConnectionStateDisconnectedStr = "disconnected"
  	iceConnectionStateFailedStr       = "failed"
  	iceConnectionStateClosedStr       = "closed"
  )

  // dtls的状态
  const (
  	dtlsTransportStateNewStr        = "new"
  	dtlsTransportStateConnectingStr = "connecting"
  	dtlsTransportStateConnectedStr  = "connected"
  	dtlsTransportStateClosedStr     = "closed"
  	dtlsTransportStateFailedStr     = "failed"
  )
  ```
- 如果pc的close标志被设置，pc为closed，该优先级最高，下面依次递减
- 如果ice和dtls有任何一个failed，pc为failed
- 如果ice为disconnected，pc为disconnected
- 如果ice为new或closed，并且dtls为new或closed，pc为new
- 如果ice为new或checking，或者dtls为new或connecting，pc为connecting
- 如果ice为connected或completed或closed，并且d·tls为connected或closed，pc为connected

一共 7*5=35 种组合，一旦出现failed状态就为failed，去除failed后共 6 * 4 = 24 种组合。因为一旦出现disconnected，状态为disconnected，去除disconnected后，共 5 * 4 = 20 种组合。因为ice和dlts都为new或closed后状态为new，去除new后，共 20 - 4 = 16 种组合。去除connected状态，该状态共3 * 2 - 1= 5种，去除后共 16 - 5 = 11 种状态，剩下11种状态都是connecting

### 2.状态改变时机

只要ice或dtls状态改变，pc的状态就有可能改变，所以需要找到ice和dtls状态改变的时机

- pc在close的时候，会调用改变pc状态的回调，此时状态为closed
- 在startTransports中会调用改变pc状态的回调，此时状态未知
- 在iceTransport的internalOnConnectionStateChangeHandler回调中会调用改变pc状态的回调，这个回调会注册到ice Agent的OnConnectionStateChange回调中，ice Agent的回调都在agent_handler.go文件中
- ice Agent在流程中会调用updateConnectionState函数来向chan中传递状态，从而传给回调
- dtls的状态改变通过调用DtlsTransport的onStateChange函数实现

### 3.ice状态改变时机

- Agent的Restart会将状态变为checking
- startConnectivityChecks会将状态变为checking
- setSelectedPair会将状态变为connected
- connectivityChecks检测到超时会将状态改为failed
- validateSelectedPair会视情况将状态置为failed、disconnected、connected
- taskLoop退出会将状态变为closed

### 4.dtls状态改变时机

- DtlsTransport在创建时状态为new
- DtlsTransport.Start开始会将状态变为connecting
- DtlsTransport.Start结束后会将状态变为connected
- DtlsTransport.Start函数在执行过程中遇到任何错误都会将状态变为failed
- DtlsTransport.Stop会将状态变为stop

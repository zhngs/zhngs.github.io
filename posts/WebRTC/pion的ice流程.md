---
date: '2023-08-29'
---
### 1.ice大概流程

- 通过API创建PeerConnection的函数NewPeerConnection中会调用createICETransport创建ice transport
- createICETransport会注册ice transport内部的状态改变回调，该回调会调用pc的状态改变回调
- SetRemoteDescription后会调用startTransports函数开启ice transport和dtls transport
- ICETransport的Start函数在ensureGatherer会创建ice agent，在agent上注册OnConnectionStateChange回调、OnSelectedCandidatePairChange回调，根据agent的角色来确定是Dial还是Accept
- ice transport最底层的udp socket是在candidateBase结构中，底层数据的收发都要经过candidateBase

### 2.收集candidate流程

- 收集candidate的入口是ICEGatherer结构的Gather函数，最终调用到ice模块中Agent的gatherCandidates函数

  ```go
  for _, t := range a.candidateTypes {
  		switch t {
  		case CandidateTypeHost:
  			wg.Add(1)
  			go func() {
  				a.gatherCandidatesLocal(ctx, a.networkTypes)
  				wg.Done()
  			}()
  		case CandidateTypeServerReflexive:
  			wg.Add(1)
  			go func() {
  				if a.udpMuxSrflx != nil {
  					a.gatherCandidatesSrflxUDPMux(ctx, a.urls, a.networkTypes)
  				} else {
  					a.gatherCandidatesSrflx(ctx, a.urls, a.networkTypes)
  				}
  				wg.Done()
  			}()
  			if a.extIPMapper != nil && a.extIPMapper.candidateType == CandidateTypeServerReflexive {
  				wg.Add(1)
  				go func() {
  					a.gatherCandidatesSrflxMapped(ctx, a.networkTypes)
  					wg.Done()
  				}()
  			}
  		case CandidateTypeRelay:
  			wg.Add(1)
  			go func() {
  				a.gatherCandidatesRelay(ctx, a.urls)
  				wg.Done()
  			}()
  		case CandidateTypePeerReflexive, CandidateTypeUnspecified:
  		}
  	}
  ```
- 遍历Agent的candidateTypes列表，根据不同的candidate类型来调用不同的收集函数
- 在gatherCandidatesLocal函数中会收集本机的所有ip，并打开udp或tcp socket，将其封装成candidate加入到Agent中
- 收集完candidate后，会调用addCandidate，其中会筛选出同种协议类型（udp4、udp6、tcp4、tcp6）的remote candidate列表，并挨个组成candidate pair

### 问题

#### 如何确定ice的role？

RFC 8445 S6.1.1

- 如果a端是ice-lite，b端不是，那么b端必须是controlling role
- 如果a和b都是ice-lite或者都不是，那么发起offer方的一端是controlling role

#### pion何时开始收集candidate？

- SetRemoteDescription和createOffer函数中会调用iceTransport.restart()来收集candidate

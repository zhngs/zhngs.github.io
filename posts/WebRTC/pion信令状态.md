---
date: '2023-09-07'
---
### 1.状态

共有5种状态

- stable，这种状态有可能sdp交换还没开始，也有可能已经完成交换
- have-local-offer
- have-remote-offer
- have-remote-pranswer
- have-local-pranswer
- closed，此状态pc已经关闭

### 2.状态变化

信令状态变化理解起来比较简单，stable即是起点也是终点，从stable只能转移到have-local-offer和have-remote-offer。从have-local-offer转移到stable有两条路径，如果直接设置最终的answer，状态变为stable；如果接受了中间状态的pranswer，状态变为have-remote-pranswer，然后接受最终的answer，状态才会变为stable。have-remote-offer变为stable的状态改变也类似

- stable->SetLocal(offer)->have-local-offer
- stable->SetRemote(offer)->have-remote-offer
- have-local-offer->SetRemote(answer)->stable
- have-local-offer->SetRemote(pranswer)->have-remote-pranswer
- have-remote-pranswer->SetRemote(answer)->stable
- have-remote-offer->SetLocal(answer)->stable
- have-remote-offer->SetLocal(pranswer)->have-local-pranswer
- have-local-pranswer->SetLocal(answer)->stable

---
date: '2023-09-08'
---
### 1.相关函数

PeerConnection有两个生成sdp的函数，generateUnmatchedSDP和generateMatchedSDP

- generateUnmatchedSDP生成sdp的时候不会将remote sdp考虑进去
- generateMatchedSDP生成sdp的时候会将remote sdp考虑进去

最终都会调用populateSDP函数，将PeerConnection的状态序列化成sdp


### 2.populateSDP函数

- pion只会在第一个m line添加candidate

---
date: '2023-09-22'
---
文档：https://www.rfc-editor.org/rfc/rfc6184

### 1.封装方式

- 单nalu模式
- 非交错模式
- 交错模式

不同方式支持的h264 type如下

```
      Payload Packet    Single NAL    Non-Interleaved    Interleaved
      Type    Type      Unit Mode           Mode             Mode
      -------------------------------------------------------------
      0      reserved      ig               ig               ig
      1-23   NAL unit     yes              yes               no
      24     STAP-A        no              yes               no
      25     STAP-B        no               no              yes
      26     MTAP16        no               no              yes
      27     MTAP24        no               no              yes
      28     FU-A          no              yes              yes
      29     FU-B          no               no              yes
      30-31  reserved      ig               ig               ig
```

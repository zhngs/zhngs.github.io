---
date: '2022-08-23'
---

## 1.API
API能够配置PeerConnection的各种行为，其包含三个结构体SettingEngine、MediaEngine、Interceptors。SettingEngine可以配置自定义行为，MediaEngine可以配置编解码，Interceptors可以配置媒体行为
```go
type API struct {
	settingEngine       *SettingEngine
	mediaEngine         *MediaEngine
	interceptorRegistry *interceptor.Registry

	interceptor interceptor.Interceptor // Generated per PeerConnection
}
```
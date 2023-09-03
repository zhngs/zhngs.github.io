---
date: '2023-09-03'
---

### 1.定制日志

pion的settingEngine中有LoggerFactory字段，可以用来自定义日志

### 2.使用zap实现pion的自定义日志

以下代码使用zap实现pion自定义日志，有几个细节需要注意
- 没有调用logger.sync，程序退出时有可能会日志丢失，如果生产环境使用需要注意这一点，这里只是做日常debug使用
- zap需要调用AddCallerSkip多加一层栈回溯，目的是为了找到正确的文件和行号

```go
type customLogger struct {
	logger *zap.Logger
}

func (c *customLogger) Trace(msg string) { c.logger.Debug(msg, zap.String("pionLevel", "trace")) }
func (c *customLogger) Tracef(format string, args ...interface{}) {
	c.logger.Debug(fmt.Sprintf(format, args...), zap.String("pionLevel", "trace"))
}
func (c *customLogger) Debug(msg string) { c.logger.Debug(msg) }
func (c *customLogger) Debugf(format string, args ...interface{}) {
	c.logger.Debug(fmt.Sprintf(format, args...))
}
func (c *customLogger) Info(msg string) { c.logger.Info(msg) }
func (c *customLogger) Infof(format string, args ...interface{}) {
	c.logger.Info(fmt.Sprintf(format, args...))
}
func (c *customLogger) Warn(msg string) { c.logger.Warn(msg) }
func (c *customLogger) Warnf(format string, args ...interface{}) {
	c.logger.Warn(fmt.Sprintf(format, args...))
}
func (c *customLogger) Error(msg string) { c.logger.Error(msg) }
func (c *customLogger) Errorf(format string, args ...interface{}) {
	c.logger.Error(fmt.Sprintf(format, args...))
}

type customLoggerFactory struct{}

func (c customLoggerFactory) NewLogger(subsystem string) logging.LeveledLogger {
	cfg := zap.Config{
		Level:             zap.NewAtomicLevelAt(zapcore.DebugLevel),
		Development:       true,
		DisableCaller:     false,
		DisableStacktrace: false,
		Encoding:          "console",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "T",
			LevelKey:       "L",
			NameKey:        "N",
			CallerKey:      "C",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "M",
			StacktraceKey:  "S",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.LowercaseColorLevelEncoder,
			EncodeTime:     zapcore.RFC3339NanoTimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.FullCallerEncoder,
		},
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
	}
	logger := zap.Must(cfg.Build())
	logger = logger.WithOptions(zap.AddCallerSkip(1))
	// defer logger.Sync()
	return &customLogger{
		logger: logger,
	}
}

func main() {
	// Create a new API with a custom logger
	// This SettingEngine allows non-standard WebRTC behavior
	s := webrtc.SettingEngine{
		LoggerFactory: customLoggerFactory{},
	}
    // ......
}
```
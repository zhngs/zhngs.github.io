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

## 2.SettingEngine

```go
// SettingEngine allows influencing behavior in ways that are not
// supported by the WebRTC API. This allows us to support additional
// use-cases without deviating from the WebRTC API elsewhere.
type SettingEngine struct {
	ephemeralUDP struct {
		PortMin uint16
		PortMax uint16
	}
	detach struct {
		DataChannels bool
	}
	timeout struct {
		ICEDisconnectedTimeout    *time.Duration
		ICEFailedTimeout          *time.Duration
		ICEKeepaliveInterval      *time.Duration
		ICEHostAcceptanceMinWait  *time.Duration
		ICESrflxAcceptanceMinWait *time.Duration
		ICEPrflxAcceptanceMinWait *time.Duration
		ICERelayAcceptanceMinWait *time.Duration
	}
	candidates struct {
		ICELite                  bool
		ICENetworkTypes          []NetworkType
		InterfaceFilter          func(string) bool
		IPFilter                 func(net.IP) bool
		NAT1To1IPs               []string
		NAT1To1IPCandidateType   ICECandidateType
		MulticastDNSMode         ice.MulticastDNSMode
		MulticastDNSHostName     string
		UsernameFragment         string
		Password                 string
		IncludeLoopbackCandidate bool
	}
	replayProtection struct {
		DTLS  *uint
		SRTP  *uint
		SRTCP *uint
	}
	dtls struct {
		insecureSkipHelloVerify   bool
		disableInsecureSkipVerify bool
		retransmissionInterval    time.Duration
		ellipticCurves            []dtlsElliptic.Curve
		connectContextMaker       func() (context.Context, func())
		extendedMasterSecret      dtls.ExtendedMasterSecretType
		clientAuth                *dtls.ClientAuthType
		clientCAs                 *x509.CertPool
		rootCAs                   *x509.CertPool
		keyLogWriter              io.Writer
	}
	sctp struct {
		maxReceiveBufferSize uint32
	}
	sdpMediaLevelFingerprints                 bool
	answeringDTLSRole                         DTLSRole
	disableCertificateFingerprintVerification bool
	disableSRTPReplayProtection               bool
	disableSRTCPReplayProtection              bool
	net                                       transport.Net
	BufferFactory                             func(packetType packetio.BufferPacketType, ssrc uint32) io.ReadWriteCloser
	LoggerFactory                             logging.LoggerFactory
	iceTCPMux                                 ice.TCPMux
	iceUDPMux                                 ice.UDPMux
	iceProxyDialer                            proxy.Dialer
	iceDisableActiveTCP                       bool
	disableMediaEngineCopy                    bool
	srtpProtectionProfiles                    []dtls.SRTPProtectionProfile
	receiveMTU                                uint
}
```

## 2. MediaEngine

```go
// A MediaEngine defines the codecs supported by a PeerConnection, and the
// configuration of those codecs.
type MediaEngine struct {
	// If we have attempted to negotiate a codec type yet.
	negotiatedVideo, negotiatedAudio bool

	videoCodecs, audioCodecs                     []RTPCodecParameters
	negotiatedVideoCodecs, negotiatedAudioCodecs []RTPCodecParameters

	headerExtensions           []mediaEngineHeaderExtension
	negotiatedHeaderExtensions map[int]mediaEngineHeaderExtension

	mu sync.RWMutex
}
```

## 3.PeerConnection

```go
// PeerConnection represents a WebRTC connection that establishes a
// peer-to-peer communications with another PeerConnection instance in a
// browser, or to another endpoint implementing the required protocols.
type PeerConnection struct {
	statsID string
	mu      sync.RWMutex

	sdpOrigin sdp.Origin

	// ops is an operations queue which will ensure the enqueued actions are
	// executed in order. It is used for asynchronously, but serially processing
	// remote and local descriptions
	ops *operations

	configuration Configuration

	currentLocalDescription  *SessionDescription
	pendingLocalDescription  *SessionDescription
	currentRemoteDescription *SessionDescription
	pendingRemoteDescription *SessionDescription
	signalingState           SignalingState
	iceConnectionState       atomic.Value // ICEConnectionState
	connectionState          atomic.Value // PeerConnectionState

	idpLoginURL *string

	isClosed               *atomicBool
	isNegotiationNeeded    *atomicBool
	negotiationNeededState negotiationNeededState

	lastOffer  string
	lastAnswer string

	// a value containing the last known greater mid value
	// we internally generate mids as numbers. Needed since JSEP
	// requires that when reusing a media section a new unique mid
	// should be defined (see JSEP 3.4.1).
	greaterMid int

	rtpTransceivers []*RTPTransceiver

	onSignalingStateChangeHandler     func(SignalingState)
	onICEConnectionStateChangeHandler atomic.Value // func(ICEConnectionState)
	onConnectionStateChangeHandler    atomic.Value // func(PeerConnectionState)
	onTrackHandler                    func(*TrackRemote, *RTPReceiver)
	onDataChannelHandler              func(*DataChannel)
	onNegotiationNeededHandler        atomic.Value // func()

	iceGatherer   *ICEGatherer
	iceTransport  *ICETransport
	dtlsTransport *DTLSTransport
	sctpTransport *SCTPTransport

	// A reference to the associated API state used by this connection
	api *API
	log logging.LeveledLogger

	interceptorRTCPWriter interceptor.RTCPWriter
}
```
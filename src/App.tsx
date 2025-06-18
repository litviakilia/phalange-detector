import { useEffect, useRef, useState } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { useHandStore } from './store/handStore'
import { HandTracker } from './lib/handTracker'
import { PressDetector } from './lib/pressDetector'
import { Overlay } from './components/Overlay'
import { PermissionDialog } from './components/PermissionDialog'
import { LogWindow } from './components/LogWindow'

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [handTracker, setHandTracker] = useState<HandTracker | null>(null)
  const [pressDetector] = useState(() => new PressDetector())
  const setJoints = useHandStore(state => state.setJoints)
  const setPresses = useHandStore(state => state.setPresses)
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    log(`App loaded at URL: ${window.location.href}`)
    log(`User agent: ${navigator.userAgent}`)
    const initHandLandmarker = async () => {
      log('Initializing HandLandmarker...')
      try {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm')
        log('FilesetResolver loaded')
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2
        })
        setHandTracker(new HandTracker(landmarker))
        log('HandLandmarker initialized successfully')
      } catch (e: any) {
        if (e instanceof Error) {
          log('HandLandmarker error: ' + e.message)
          if (e.stack) log('HandLandmarker error stack: ' + e.stack)
        } else if (typeof e === 'object') {
          log('HandLandmarker error (object): ' + JSON.stringify(e))
          if (e.type) log('Error type: ' + e.type)
          if (e.target) log('Error target: ' + JSON.stringify(e.target))
        } else {
          log('HandLandmarker error (other): ' + String(e))
        }
      }
    }
    initHandLandmarker()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!handTracker || !videoRef.current) return
    let animationFrame: number
    let lastVideoTime = -1
    let frameCount = 0
    const detect = async () => {
      const video = videoRef.current
      if (!video) return
      if (video.currentTime !== lastVideoTime) {
        frameCount++
        log(`Processing frame #${frameCount} (video time: ${video.currentTime.toFixed(2)}s)`) 
        try {
          const joints = await handTracker.detectHands(video)
          if (joints && joints.length > 0) {
            setJoints(joints)
            log(`Detected ${joints.length} joints`)
            const presses = pressDetector.detectPresses(joints)
            setPresses(presses)
            log(`Detected ${presses.length} presses`)
          } else {
            setJoints(null)
            setPresses([])
            log('No hands detected')
          }
        } catch (err) {
          log('Error during hand detection: ' + (err instanceof Error ? err.message : JSON.stringify(err)))
        }
        lastVideoTime = video.currentTime
      }
      animationFrame = requestAnimationFrame(detect)
    }
    log('Starting hand detection loop')
    detect()
    return () => {
      log('Stopping hand detection loop')
      cancelAnimationFrame(animationFrame)
    }
  }, [handTracker, pressDetector, setJoints, setPresses])

  const log = (msg: string) => setLogs(l => [...l, `[${new Date().toLocaleTimeString()}] ${msg}`])

  const startCamera = async (mode = cameraMode) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
      setStream(newStream)
      log(`Camera started (${mode === 'user' ? 'Front' : 'Back'})`)
    } catch (err) {
      log('Camera access denied: ' + err)
      setShowPermissionDialog(true)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      log('Camera stopped')
    }
  }

  const toggleCamera = () => {
    const newMode = cameraMode === 'user' ? 'environment' : 'user'
    setCameraMode(newMode)
    startCamera(newMode)
    log(`Switched to ${newMode === 'user' ? 'Front' : 'Back'} camera`)
  }

  useEffect(() => {
    startCamera(cameraMode)
    // eslint-disable-next-line
  }, [])

  return (
    <div className="camera-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
      <Overlay />
      {showPermissionDialog && (
        <PermissionDialog onClose={() => setShowPermissionDialog(false)} />
      )}
      {showLogs && <LogWindow logs={logs} onClose={() => setShowLogs(false)} />}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1001,
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        padding: '20px 0',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <button style={{
          fontSize: 20,
          padding: '18px 32px',
          borderRadius: 12,
          border: 'none',
          background: '#0066ff',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }} onClick={toggleCamera}>
          Switch Camera
        </button>
        <button style={{
          fontSize: 20,
          padding: '18px 32px',
          borderRadius: 12,
          border: 'none',
          background: '#ff3333',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }} onClick={stopCamera}>
          Stop Camera
        </button>
        <button style={{
          fontSize: 20,
          padding: '18px 32px',
          borderRadius: 12,
          border: 'none',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }} onClick={() => setShowLogs(l => !l)}>
          {showLogs ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>
    </div>
  )
}

export default App 
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
    const initHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks('/cdn/npm/@mediapipe/tasks-vision@0.10.12/wasm')
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/cdn/npm/@mediapipe/tasks-vision@0.10.12/wasm/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 2
      })
      setHandTracker(new HandTracker(landmarker))
    }
    initHandLandmarker().catch(e => log('HandLandmarker error: ' + e))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!handTracker || !videoRef.current) return
    let animationFrame: number
    let lastVideoTime = -1
    const detect = async () => {
      const video = videoRef.current
      if (!video) return
      if (video.currentTime !== lastVideoTime) {
        const joints = await handTracker.detectHands(video)
        if (joints) {
          setJoints(joints)
          setPresses(pressDetector.detectPresses(joints))
        }
        lastVideoTime = video.currentTime
      }
      animationFrame = requestAnimationFrame(detect)
    }
    detect()
    return () => cancelAnimationFrame(animationFrame)
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
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button onClick={toggleCamera} style={{ marginRight: 8 }}>
          Switch Camera
        </button>
        <button onClick={stopCamera} style={{ marginRight: 8 }}>
          Stop Camera
        </button>
        <button onClick={() => setShowLogs(l => !l)}>
          {showLogs ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>
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
    </div>
  )
}

export default App 
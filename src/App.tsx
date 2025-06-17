import { useEffect, useRef, useState } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { useHandStore } from './store/handStore'
import { HandTracker } from './lib/handTracker'
import { PressDetector } from './lib/pressDetector'
import { Overlay } from './components/Overlay'
import { PermissionDialog } from './components/PermissionDialog'

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [handTracker, setHandTracker] = useState<HandTracker | null>(null)
  const [pressDetector] = useState(() => new PressDetector())
  const setJoints = useHandStore(state => state.setJoints)
  const setPresses = useHandStore(state => state.setPresses)

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

    initHandLandmarker().catch(console.error)
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      setShowPermissionDialog(true)
    }
  }

  useEffect(() => {
    startCamera()
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
    </div>
  )
}

export default App 
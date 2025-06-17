import { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Joint } from '../store/handStore'

export class HandTracker {
  private landmarker: HandLandmarker
  private lastDetectionTime: number = 0
  private readonly minDetectionInterval = 1000 / 30 // 30 fps max

  constructor(landmarker: HandLandmarker) {
    this.landmarker = landmarker
  }

  async detectHands(video: HTMLVideoElement): Promise<Joint[] | null> {
    const now = performance.now()
    if (now - this.lastDetectionTime < this.minDetectionInterval) {
      return null
    }

    const results = this.landmarker.detectForVideo(video, now)
    this.lastDetectionTime = now

    if (!results.landmarks || !results.landmarks[0] || results.handedness[0].score < 0.7) {
      return null
    }

    return results.landmarks[0].map((landmark: NormalizedLandmark, index) => ({
      x: landmark.x,
      y: landmark.y,
      z: landmark.z,
      type: index
    }))
  }
} 
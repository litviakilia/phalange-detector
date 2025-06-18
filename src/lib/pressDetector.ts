import { Joint, PressEvent } from '../store/handStore'

// Thresholds for pinch detection
const PINCH_THRESHOLD_MM = 12 // distance between thumb tip and index tip to be considered a pinch
const PX_TO_MM = 0.5
const PINCH_THRESHOLD_PX = PINCH_THRESHOLD_MM / PX_TO_MM
const HYSTERESIS_FRAMES = 3 // consecutive frames required to confirm state change

export class PressDetector {
  private pinchCounter = 0
  private isPinched = false
  private readonly log?: (msg: string) => void

  constructor(logFn?: (msg: string) => void) {
    this.log = logFn
  }

  private distance3D(a: Joint, b: Joint): number {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) +
      Math.pow(a.y - b.y, 2) +
      Math.pow(a.z - b.z, 2)
    )
  }

  /**
   * Detects a pinch gesture (thumb tip ↔ index finger tip).
   * Returns an array with a single PressEvent while the pinch is active, otherwise an empty array.
   */
  detectPresses(joints: Joint[] | null): PressEvent[] {
    if (!joints) {
      // Reset counters if the hand is lost
      this.pinchCounter = 0
      this.isPinched = false
      return []
    }

    const thumbTip = joints[4]
    const indexTip = joints[8]

    const distance = this.distance3D(thumbTip, indexTip)
    const underThreshold = distance < PINCH_THRESHOLD_PX

    // Update hysteresis counter
    if (underThreshold) {
      this.pinchCounter = Math.min(this.pinchCounter + 1, HYSTERESIS_FRAMES)
    } else {
      this.pinchCounter = Math.max(this.pinchCounter - 1, 0)
    }

    // State transitions with hysteresis
    if (!this.isPinched && this.pinchCounter === HYSTERESIS_FRAMES) {
      this.isPinched = true
      this.log?.('Pinch CONFIRMED')
    } else if (this.isPinched && this.pinchCounter === 0) {
      this.isPinched = false
      this.log?.('Pinch RELEASED')
    }

    if (this.isPinched) {
      return [{
        hand: 'right',
        finger: 'index',
        segment: 3,
        timestamp: performance.now()
      }]
    }

    return []
  }
} 
import { Joint, PressEvent } from '../store/handStore'

// Adjusted threshold for more sensitive detection
const PRESS_THRESHOLD_MM = 6 // tighter threshold to reduce false presses
const PX_TO_MM = 0.5
const PRESS_THRESHOLD_PX = PRESS_THRESHOLD_MM / PX_TO_MM
const HYSTERESIS_FRAMES = 3 // consecutive frames required to confirm press/release

interface Phalanx {
  hand: 'left' | 'right'
  finger: 'index' | 'middle' | 'ring' | 'pinky'
  segment: 1 | 2 | 3
  startIndex: number
  endIndex: number
}

export class PressDetector {
  private readonly phalanges: Phalanx[]
  private lastPresses: Set<string>
  private pressCounters: Map<string, number>
  private log?: (msg: string) => void

  constructor(logFn?: (msg: string) => void) {
    this.phalanges = this.initPhalanges()
    this.lastPresses = new Set()
    this.pressCounters = new Map()
    this.log = logFn
  }

  private initPhalanges(): Phalanx[] {
    const fingers = [
      { name: 'index', start: 5 },
      { name: 'middle', start: 9 },
      { name: 'ring', start: 13 },
      { name: 'pinky', start: 17 }
    ] as const

    return fingers.flatMap(({ name, start }) => 
      [1, 2, 3].map((segment) => ({
        hand: 'right' as const,
        finger: name,
        segment: segment as 1 | 2 | 3,
        startIndex: start + segment - 1,
        endIndex: start + segment
      }))
    )
  }

  private distance3D(a: Joint, b: Joint): number {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) +
      Math.pow(a.y - b.y, 2) +
      Math.pow(a.z - b.z, 2)
    )
  }

  detectPresses(joints: Joint[] | null): PressEvent[] {
    if (!joints) return []

    const thumbTip = joints[4]
    const currentPresses = new Set<string>()
    const pressEvents: PressEvent[] = []

    this.log?.(`Press threshold: ${PRESS_THRESHOLD_PX} px (${PRESS_THRESHOLD_MM} mm)`)

    this.phalanges.forEach((phalanx) => {
      const start = joints[phalanx.startIndex]
      const end = joints[phalanx.endIndex]
      // Calculate midpoint of phalanx
      const midpoint: Joint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
        z: (start.z + end.z) / 2,
        type: start.type
      }
      const distance = this.distance3D(thumbTip, midpoint)
      const id = `${phalanx.hand}-${phalanx.finger}-${phalanx.segment}`
      this.log?.(`Phalanx ${id}: distance=${distance.toFixed(4)} px`)
      const underThreshold = distance < PRESS_THRESHOLD_PX

      const count = (this.pressCounters.get(id) || 0) + (underThreshold ? 1 : -1)
      const clampedCount = Math.max(0, Math.min(HYSTERESIS_FRAMES, count))
      this.pressCounters.set(id, clampedCount)

      if (clampedCount === HYSTERESIS_FRAMES && underThreshold) {
        // Confirmed press
        currentPresses.add(id)
        if (!this.lastPresses.has(id)) {
          this.log?.(`Phalanx ${id} CONFIRMED PRESS`)
          pressEvents.push({
            hand: phalanx.hand,
            finger: phalanx.finger,
            segment: phalanx.segment,
            timestamp: performance.now()
          })
        }
      }
    })

    this.lastPresses = currentPresses
    return pressEvents
  }
} 
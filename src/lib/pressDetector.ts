import { Joint, PressEvent } from '../store/handStore'

// Assuming 0.8m hand-to-camera distance, 1px ≈ 0.5mm
const PRESS_THRESHOLD_MM = 8
const PX_TO_MM = 0.5
const PRESS_THRESHOLD_PX = PRESS_THRESHOLD_MM / PX_TO_MM

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
  private readonly hysteresis = 2 // frames

  constructor() {
    this.phalanges = this.initPhalanges()
    this.lastPresses = new Set()
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

      if (distance < PRESS_THRESHOLD_PX) {
        currentPresses.add(id)
        
        // Only trigger press event if not already pressed in last frame
        if (!this.lastPresses.has(id)) {
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
import { useEffect, useRef } from 'react'
import { useHandStore } from '../store/handStore'

export const Overlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const joints = useHandStore(state => state.joints)
  const presses = useHandStore(state => state.presses)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !joints) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Match canvas size to its display size
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw joints
    joints.forEach((joint, i) => {
      const x = joint.x * width
      const y = joint.y * height

      ctx.fillStyle = i === 4 ? '#ff0000' : '#00ff00'
      ctx.beginPath()
      ctx.arc(x, y, i === 4 ? 8 : 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw connections between joints
    const connections = [
      // Thumb
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Middle
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Ring
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Pinky
      [0, 17], [17, 18], [18, 19], [19, 20]
    ]

    connections.forEach(([i, j]) => {
      const start = joints[i]
      const end = joints[j]

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(start.x * width, start.y * height)
      ctx.lineTo(end.x * width, end.y * height)
      ctx.stroke()
    })

    // Highlight pressed segments
    presses.forEach(press => {
      const startIdx = press.finger === 'index' ? 5 :
                      press.finger === 'middle' ? 9 :
                      press.finger === 'ring' ? 13 : 17
      const segmentStart = startIdx + press.segment - 1
      const segmentEnd = segmentStart + 1

      const start = joints[segmentStart]
      const end = joints[segmentEnd]

      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(start.x * width, start.y * height)
      ctx.lineTo(end.x * width, end.y * height)
      ctx.stroke()

      // Log press event
      console.log('Press:', {
        t: press.timestamp,
        hand: press.hand,
        finger: press.finger,
        segment: press.segment
      })
    })
  }, [joints, presses])

  return <canvas ref={canvasRef} />
} 
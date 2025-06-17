import { create } from 'zustand'
import { HandLandmark } from '@mediapipe/tasks-vision'

export interface Joint {
  x: number
  y: number
  z: number
  type: HandLandmark
}

export interface PressEvent {
  hand: 'left' | 'right'
  finger: 'index' | 'middle' | 'ring' | 'pinky'
  segment: 1 | 2 | 3
  timestamp: number
}

interface HandState {
  joints: Joint[] | null
  presses: PressEvent[]
  setJoints: (joints: Joint[] | null) => void
  setPresses: (presses: PressEvent[]) => void
}

export const useHandStore = create<HandState>((set) => ({
  joints: null,
  presses: [],
  setJoints: (joints) => set({ joints }),
  setPresses: (presses) => set({ presses })
})) 
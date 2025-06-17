/// <reference types="vite/client" />

declare module '@mediapipe/tasks-vision' {
  export interface HandLandmarker {
    detectForVideo(video: HTMLVideoElement, timestamp: number): {
      landmarks: Array<Array<{
        x: number
        y: number
        z: number
      }>>
      handedness: Array<{
        score: number
      }>
    }
  }

  export interface FilesetResolver {
    forVisionTasks(path: string): Promise<FilesetResolver>
  }

  export const HandLandmarker: {
    createFromOptions(
      vision: FilesetResolver,
      options: {
        baseOptions: {
          modelAssetPath: string
          delegate: 'GPU' | 'CPU'
        }
        runningMode: 'VIDEO'
        numHands: number
      }
    ): Promise<HandLandmarker>
  }

  export const FilesetResolver: {
    forVisionTasks(path: string): Promise<FilesetResolver>
  }

  export enum HandLandmark {
    WRIST = 0,
    THUMB_CMC = 1,
    THUMB_MCP = 2,
    THUMB_IP = 3,
    THUMB_TIP = 4,
    INDEX_FINGER_MCP = 5,
    INDEX_FINGER_PIP = 6,
    INDEX_FINGER_DIP = 7,
    INDEX_FINGER_TIP = 8,
    MIDDLE_FINGER_MCP = 9,
    MIDDLE_FINGER_PIP = 10,
    MIDDLE_FINGER_DIP = 11,
    MIDDLE_FINGER_TIP = 12,
    RING_FINGER_MCP = 13,
    RING_FINGER_PIP = 14,
    RING_FINGER_DIP = 15,
    RING_FINGER_TIP = 16,
    PINKY_MCP = 17,
    PINKY_PIP = 18,
    PINKY_DIP = 19,
    PINKY_TIP = 20
  }
} 
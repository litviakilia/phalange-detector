import { FC } from 'react'
import { PressEvent } from '../store/handStore'

interface StatusBarProps {
  presses: PressEvent[]
}

export const StatusBar: FC<StatusBarProps> = ({ presses }) => {
  const text = presses.length === 0
    ? 'No pinch detected'
    : 'Pinch detected'

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 90,
      zIndex: 1002,
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '18px 0',
      letterSpacing: 1,
      borderTop: '2px solid #333',
      borderBottom: '2px solid #333',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {text}
    </div>
  )
} 
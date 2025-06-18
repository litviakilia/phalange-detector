import { FC } from 'react'

interface LogWindowProps {
  logs: string[]
  onClose: () => void
}

export const LogWindow: FC<LogWindowProps> = ({ logs, onClose }) => (
  <div style={{
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 350,
    maxHeight: 300,
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    padding: 16,
    zIndex: 1000,
    overflowY: 'auto',
    fontSize: 13
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <strong>Logs</strong>
      <button onClick={onClose} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Close</button>
    </div>
    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
      {logs.length === 0 ? <div>No logs yet.</div> : logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  </div>
) 
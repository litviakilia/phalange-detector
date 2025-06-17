import { FC } from 'react'

interface PermissionDialogProps {
  onClose: () => void
}

export const PermissionDialog: FC<PermissionDialogProps> = ({ onClose }) => {
  return (
    <div className="permission-dialog">
      <h2>Camera Access Required</h2>
      <p>
        PalmKeys needs access to your camera to detect hand movements.
        Please grant camera access in your browser settings.
      </p>
      <p>
        On iOS, go to Settings &gt; Safari &gt; Camera and select "Allow".
      </p>
      <button onClick={onClose}>Close</button>
    </div>
  )
} 
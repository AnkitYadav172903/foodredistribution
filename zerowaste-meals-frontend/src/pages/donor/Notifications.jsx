import { useNavigate } from 'react-router-dom'
import NotificationCenter from '../../components/notification/NotificationCenter'

export function Notifications() {
  const navigate = useNavigate()

  return (
    <NotificationCenter
      emptyActionLabel="Donate food"
      onEmptyAction={() => navigate('/donate')}
    />
  )
}

export default Notifications

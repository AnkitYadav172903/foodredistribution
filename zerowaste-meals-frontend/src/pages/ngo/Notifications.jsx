import { useNavigate } from 'react-router-dom'
import NotificationCenter from '../../components/notification/NotificationCenter'

export function Notifications() {
  const navigate = useNavigate()

  return (
    <NotificationCenter
      emptyActionLabel="Browse available food"
      onEmptyAction={() => navigate('/available-food')}
    />
  )
}

export default Notifications

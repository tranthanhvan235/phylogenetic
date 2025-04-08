import { Frown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './NotFoundMessage.scss'

type NotFoundMessageProps = {
  message: string
  quote?: string
  onClose?: () => void
}

const NotFoundMessage = ({ message, quote, onClose }: NotFoundMessageProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose && onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return (
    <div className='notfound'>
      <div className='notfound__header'>
        <Frown className='notfound__icon' />
        <X className='notfound__close' onClick={() => setVisible(false)} />
      </div>
      <p className='notfound__message'>{message}</p>
      {quote && <p className='notfound__quote'>"{quote}"</p>}
    </div>
  )
}

export default NotFoundMessage

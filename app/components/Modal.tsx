'use client'

import { useEffect, useState } from 'react'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [showModal, setShowModal] = useState(isOpen)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="relative mx-auto w-full max-w-md p-4"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className={`
            translate duration-300 h-full
            ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
        >
          <div className="translate relative flex h-full w-full flex-col rounded-2xl bg-white shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal 
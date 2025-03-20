'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AuthModal from './auth/AuthModal'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthModal(true)
    } else {
      setShowAuthModal(false)
    }
  }, [status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  return (
    <>
      {children}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
} 
'use client'

import { useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AuthModal from './auth/AuthModal'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const toggleAuthModal = useCallback(() => {
    if (!session) {
      setIsAuthModalOpen((value) => !value)
    }
  }, [session])

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div>Logo</div>
        <div>
          {status === 'loading' ? (
            // Show loading state
            <div>Loading...</div>
          ) : session ? (
            // User is authenticated
            <div className="flex items-center gap-4">
              <span>{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is not authenticated
            <button
              onClick={toggleAuthModal}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
} 
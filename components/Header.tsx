'use client'

import Link from "next/link";
import { Search, Home, Zap, Target, Settings, User } from "lucide-react";
import { useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AuthModal from '@/app/components/auth/AuthModal'

export default function Header() {
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const toggleAuthModal = useCallback(() => {
    if (!session) {
      setIsAuthModalOpen((value) => !value)
    }
  }, [session])

  return (
    <header className="w-full flex items-center justify-between py-3 px-2 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-6">
        <Link href={"/"} className="flex items-center">
          <h1 className="text-xl font-bold">WORKOUT.IO</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none w-[180px] md:w-[220px]"
          />
          <Search size={16} className="absolute left-3 text-gray-500 outline-none" />
        </div>
        
        <Link 
          href="/settings" 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings size={20} className="text-gray-700 dark:text-gray-300" />
        </Link>
        
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="rounded-lg bg-red-500 px-4 py-2 text-white text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleAuthModal}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <User size={16} />
          </button>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
} 
'use client'

import Link from "next/link";
import { Search, Home, Zap, Target, Settings, User, Save, Menu, X } from "lucide-react";
import { useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AuthModal from '@/app/components/auth/AuthModal'

export default function Header() {
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleAuthModal = useCallback(() => {
    if (!session) {
      setIsAuthModalOpen((value) => !value)
    }
  }, [session])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full relative">
      <div className="flex items-center justify-between py-3 px-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <Link href={"/"} className="flex items-center">
            <h1 className="text-xl font-bold">WORKOUT.IO</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {session && (
              <Link
                href="/protected/saved-workouts"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Save size={18} />
                <span>Saved Workouts</span>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none w-[180px] md:w-[220px]"
            />
            <Search size={16} className="absolute left-3 text-gray-500 outline-none" />
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Desktop settings button */}
          <div className="hidden md:block">
            <Link 
              href="/settings" 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings size={20} className="text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
          
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:block">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-lg bg-red-500 px-4 py-2 text-white text-sm hidden md:block"
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
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4 z-50">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {session && (
              <>
                <Link
                  href="/protected/saved-workouts"
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Save size={18} />
                  <span>Saved Workouts</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Signed in as {session.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg bg-red-500 px-4 py-2 text-white text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
} 
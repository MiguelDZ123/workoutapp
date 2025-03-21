'use client'

import Link from "next/link";
import { Search, Home, Zap, Target, Settings, User, Save, Menu, X } from "lucide-react";
import { useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AuthModal from '@/app/components/auth/AuthModal'
import Image from 'next/image'

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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between py-3 px-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <Link href={"/"} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="WORKOUT.IO"
              width={150}
              height={40}
              className="dark:brightness-200"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
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

          {/* Desktop settings button */}
          
          {status === 'loading' ? (
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4 z-50">
          <nav className="flex flex-col space-y-4">
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
                    Signed in as {session.user?.name || session.user?.email}
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
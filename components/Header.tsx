'use client'

import Link from "next/link";
import { Search, Home, Zap, Target, Settings, User, Save, Menu, X, ChevronLeft, LayoutGrid, UserCog, AlertCircle, FileText, Smartphone, MessageSquare, SaveIcon, Banknote, BookOpenText } from "lucide-react";
import { SyntheticEvent, useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import AuthModal from '@/app/components/auth/AuthModal'
import Image from 'next/image'

export default function Header(this: any) {
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

  const addImageFallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'https://transplant.org.au/wp-content/uploads/2018/06/James-avatar-for-website.png';
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-12">
          <Link href={"/"} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="WORKOUT.IO"
              width={180}
              height={48}
              className="dark:brightness-200"
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Features
            </Link>
            <Link href="/solutions" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Documentation
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Pricing
            </Link>
            {session && (
              <Link href="/protected/saved-workouts" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                My Workouts
              </Link>)
            }
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none w-[180px] lg:w-[220px]"
            />
            <Search size={16} className="absolute left-3 text-gray-500" />
          </div>


          {status === 'loading' ? (
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <img className="rounded-full h-8 w-8" src={`${session.user?.image}`} onError={addImageFallback}/>
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="h-6 w-6" />
                ) : (
                  <Menu size={24} className="h-6 w-6" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors max-sm:hidden"
              >
                Sign in
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="h-6 w-6" />
                ) : (
                  <Menu size={24} className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 w-full max-w-lg bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <Link href={"/"} className="flex items-center">
                  <Image
                    src="/images/logo.png"
                    alt="WORKOUT.IO"
                    width={180}
                    height={48}
                    className="dark:brightness-200"
                  />
                </Link>
              </div>

              <nav className="flex-1 px-4 py-6">
                <div className="space-y-6">
                  <Link
                    href="/summary"
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutGrid size={20} />
                    <span>Features</span>
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpenText size={20} />
                    <span>Documentation</span>
                  </Link>
                  <Link
                    href="/alerts"
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Banknote size={20} />
                    <span>Pricing</span>
                  </Link>
                  {session && (
                    <Link
                      href="/protected/saved-workouts"
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <SaveIcon size={20} />
                      <span>Saved Workouts</span>
                    </Link>

                  )}
                </div>
              </nav>

              <div className="mt-auto px-4 pb-8 space-y-6">
                <div className="space-y-3">
                  <Link
                    href="/terms"
                    className="block text-sm text-gray-600 dark:text-gray-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="block text-sm text-gray-600 dark:text-gray-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>

                {status === 'loading' ? (
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ) : session ? (<button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Logout
                </button>) : (<button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Sign in
                </button>)}
              </div>
            </div>
          </div>
        </div>
      )
      }
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header >
  );
} 
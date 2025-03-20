'use client'

import { useCallback, useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import Modal from '../Modal'
import EmailVerification from './EmailVerification'

interface AuthModalProps {
  isOpen?: boolean
  onClose: () => void
}

enum VARIANT {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LOGIN)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session?.user && isOpen) {
      router.refresh()
      onClose()
    }
  }, [session, isOpen, onClose, router])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    try {
      if (variant === VARIANT.REGISTER) {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          setVerificationEmail(data.email)
          setShowVerification(true)
        } else {
          toast.error('Something went wrong!')
        }
      } else {
        // Login
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
          callbackUrl: '/'
        })

        if (result?.error) {
          toast.error('Invalid credentials!')
        }

        if (result?.ok && !result?.error) {
          toast.success('Logged in!')
          router.refresh()
          onClose()
        }
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }

    setIsLoading(false)
  }

  const handleVerified = async () => {
    // Sign in after verification
    const result = await signIn('credentials', {
      email: verificationEmail,
      password: getValues('password'),
      redirect: false,
      callbackUrl: '/'
    })

    if (result?.ok && !result?.error) {
      toast.success('Logged in!')
      router.refresh()
      onClose()
    }
  }

  const socialAction = async (action: string) => {
    setIsLoading(true)

    try {
      const result = await signIn(action, {
        redirect: false,
        callbackUrl: '/'
      })

      if (result?.error) {
        toast.error('Invalid credentials!')
      }

      if (result?.ok && !result?.error) {
        toast.success('Logged in!')
        router.refresh()
        onClose()
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }

    setIsLoading(false)
  }

  const toggleVariant = useCallback(() => {
    setVariant(variant === VARIANT.LOGIN ? VARIANT.REGISTER : VARIANT.LOGIN)
  }, [variant])

  if (status === 'loading') {
    return null
  }

  if (session?.user) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {showVerification ? (
        <EmailVerification
          email={verificationEmail}
          onVerified={handleVerified}
        />
      ) : (
        <div className="w-full px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">
              {variant === VARIANT.LOGIN ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-gray-600">
              {variant === VARIANT.LOGIN 
                ? 'Please enter your details to sign in.'
                : 'Please fill in the information below.'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => socialAction('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => socialAction('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <AiFillGithub size={20} />
              <span>Continue with GitHub</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {variant === VARIANT.REGISTER && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    {...register('name', { required: variant === VARIANT.REGISTER })}
                    type="text"
                    placeholder="Enter your name"
                    disabled={isLoading}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${errors.name ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  {...register('password', { required: true })}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                />
              </div>

              {variant === VARIANT.LOGIN && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember for 30 days
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.error('Feature coming soon!')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {variant === VARIANT.LOGIN ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              {variant === VARIANT.LOGIN ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleVariant}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {variant === VARIANT.LOGIN ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default AuthModal 
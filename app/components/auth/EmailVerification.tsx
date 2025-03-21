'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import OTPInput from './OTPInput'

interface EmailVerificationProps {
  email: string
  onVerified: () => void
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified
}) => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const sendVerificationEmail = async () => {
    try {
      setIsSending(true)
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) throw new Error()
      
      toast.success('Verification code sent to your email')
    } catch (error) {
      toast.error('Failed to send verification code')
    } finally {
      setIsSending(false)
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success('Email verified successfully')
      onVerified()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-8 px-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
        <p className="text-gray-600">
          We've sent a verification code to {email}
        </p>
      </div>

      <div className="space-y-4">
        <OTPInput
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
        />

        <button
          onClick={verifyOTP}
          disabled={otp.length !== 6 || isLoading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className="text-center">
          <button
            onClick={sendVerificationEmail}
            disabled={isSending}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isSending ? 'Sending...' : "Didn't receive the code? Send again"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification 
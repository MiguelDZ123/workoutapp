import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import prisma from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store OTP in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires: expiresAt
      }
    })

    // Send email with OTP
    await resend.emails.send({
      from: 'migui.manda1@gmail.com',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })

    return NextResponse.json({ message: 'Verification email sent' })
  } catch (error) {
    console.error('VERIFICATION_EMAIL_ERROR', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 
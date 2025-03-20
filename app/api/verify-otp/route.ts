import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp } = body

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date()
        }
      }
    })

    if (!verificationToken) {
      return new NextResponse('Invalid or expired code', { status: 400 })
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date()
        }
      }
    })

    return NextResponse.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('VERIFY_OTP_ERROR', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 
import bcrypt from 'bcrypt'
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { AuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'email', type: 'text' },
          password: { label: 'password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials')
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })
  
          if (!user || !user?.hashedPassword) {
            throw new Error('Invalid credentials')
          }
  
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          )
  
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials')
          }
  
          return user
        }
      })
    ],
    pages: {
      signIn: '/',
      error: '/'
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }
        return token
      },
      async session({ session, token }) {
        if (session?.user) {
          session.user.email = token.id as string
        }
        return session
      }
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
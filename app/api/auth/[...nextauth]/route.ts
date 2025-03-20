import bcrypt from 'bcrypt'
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { AuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
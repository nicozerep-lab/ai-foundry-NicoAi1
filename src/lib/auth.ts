import NextAuth from 'next-auth'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import EmailProvider from 'next-auth/providers/email'
// import { prisma } from './prisma'

export const authOptions = {
  // adapter: PrismaAdapter(prisma), // Uncomment when database is ready
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session: ({ session, user }: any) => ({
      ...session,
      user: {
        ...session.user,
        id: user?.id || session.user.email,
      },
    }),
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
}

export default NextAuth(authOptions)
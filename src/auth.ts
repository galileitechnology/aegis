// app/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByCredentials } from "./lib/user";

// Debug: Check if environment variables are loaded
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await findUserByCredentials(
          credentials.username as string,
          credentials.password as string
        );
        return user;
      },
    }),
  ],
  
  // ADD THESE CRITICAL SETTINGS:
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
  },
  
  // Fix for production redirects
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  
  // Use secure cookies in production
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});
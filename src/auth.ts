import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByCredentials } from "./lib/user";

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
});

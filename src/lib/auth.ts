import { NextAuthOptions } from "next-auth";
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb-fallback";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { connectDB } from "./mongoose";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
          return null;
        }

        try {
          await connectDB();
          console.log('Attempting to find user with email:', credentials.email);
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log('User not found with email:', credentials.email);
            return null;
          }
          
          console.log('User found, comparing passwords');
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!passwordMatch) {
            console.log('Password mismatch for user:', credentials.email);
            return null;
          }
          
          console.log('Authentication successful for user:', credentials.email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn callback:', { user, account, profile, email });
      return true;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  events: {
    async signIn(message) {
      console.log('SignIn event:', message);
    },
    async signOut(message) {
      console.log('SignOut event:', message);
    },
    async error(message) {
      console.error('Auth error event:', message);
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }
  return session.user;
} 
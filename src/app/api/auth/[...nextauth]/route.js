"use server";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../../lib/mongodb";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("mydatabase");
        console.log(credentials);

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });
        console.log(user);

        if (!user) {
          return null;
        }



        
  const now = new Date();
  if (user.lockUntil && user.lockUntil > now && user.failedAttempts>=3) {
    
    throw new Error("Account is temporarily locked. Try again later.");
  }


  if (user.lockUntil && user.lockUntil <= now) {
   
    await db.collection("users").updateOne(
      { email: credentials.email },
      { $set: { failedAttempts: 0, lockUntil: null } }
    );
  }


  if (user.password !== credentials.password) {
    let updateData = {
      $inc: { failedAttempts: 1 },
      $set: {},
    };
  
    if (user.failedAttempts + 1 >= 3) {
      const lockTime = new Date(Date.now() + 3 * 60 * 1000);
      updateData.$set.lockUntil = lockTime;
    }
  
    if (Object.keys(updateData.$set).length === 0) {
      delete updateData.$set;
    }
  
    await db.collection("users").updateOne({ email: credentials.email }, updateData);
  
    throw new Error("Invalid email or password.You can use 3 login attempts");
  }
  


  

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          image: user.photoURL,
        };
      },
    }),



    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

   
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.role = token.role;
          session.user.image = token.image;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 60 * 60 * 24,
  },
});

export { handler as GET, handler as POST };

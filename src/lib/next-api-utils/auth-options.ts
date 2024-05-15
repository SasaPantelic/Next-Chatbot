import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@db/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt'
import { JWT } from 'next-auth/jwt';
// import sendConfirmationEmail from '@lib/email';



export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      id: "email-login", // <- add this line
      // If User signs in with email & password and then signs in with google while logged in, it will link the OAUTH Account
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log('credentials', credentials);

        let authorized = false
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        })
        if(user && !user.passwordhash){
          console.log('no password hash')
          return null
        }
        console.log('user', user);
        console.log(credentials?.password, user?.passwordhash);
        if (user) {
          authorized = await bcrypt.compare(credentials?.password, user?.passwordhash);
          console.log('authorized', authorized)
        }
        if (!authorized) {
          return null
        }

        // if (!user?.emailVerified) {
        //   if (!user?.sentEmailVerification) {
        //     await sendConfirmationEmail(user?.email, user?.name, user?.confirmationCode)
        //     await prisma.user.update({
        //       where: {
        //         id: user?.id
        //       },
        //       data: {
        //         sentEmailVerification: true
        //       }
        //     })
        //   }
        //   return null
        // }

        return user

        // if (authorized) {
        //   // Any object returned will be saved in `user` property of the JWT
        //   return user
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   return null
        //   // return Promise.reject(new Error('Invalid Email or Password'))
        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter        
        // }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    // session({ session, user }) {
    //   if (user) {
    //     session.user.id = user.id;
    //   }
    //   return session;
    // },
    // async session({ session, user }: {}) {
    //   if (user) {
    //     session.user.id = user.id;
    //   }
    //   return session
    // }
    async session({ session, user }: {
      session: AuthSession;
      user: SessionUser;
      jwt: JWT
    }) {
      if (user) {
        session.user.id = user.id;
      }
      const userLookup = await prisma.user.findUnique({
        where: {
          email: session.user.email
        }
      })
      if (userLookup) {
        session.user.emailVerified = userLookup.emailVerified
        session.user.image = userLookup.image
        session.user.username = userLookup.username
        session.user.birthday = userLookup.birthday
        session.user.gender = userLookup.gender
        session.user.description = userLookup.description
        session.user.tutorialCompleted = userLookup.tutorialCompleted
        session.user.signupCompleted = userLookup.signupCompleted
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      // console.log('user', user, 'account', account, 'profile', profile, 'email', email, 'credentials', credentials);

      const userLookup = await prisma.user.findFirst({
        where: {
          email: user.email
        },
      })
      if (userLookup) {
        // Check if user has verified their email if not send them a new email if they have not already been sent one
        // if user has a null field for authMethod then it should be looked up in Account table
        // And set it to the provider column 
        if (!userLookup.authMethod) {
          if (account) {
            const userUpdate = await prisma.user.update({
              where: {
                id: userLookup.id
              },
              data: {
                authMethod: account.provider
              }
            })
          }
        }
        // if (!userLookup.emailVerified && (!profile && !profile?.email_verified)) {
        //   if (!userLookup.sentEmailVerification) {
        //     await sendConfirmationEmail(userLookup?.email, userLookup.name, userLookup.confirmationCode)
        //     await prisma.user.update({
        //       where: {
        //         id: userLookup.id
        //       },
        //       data: {
        //         sentEmailVerification: true
        //       }
        //     })
        //   }
        //   return true
        // }
      }
      if (!userLookup) {
        return true
      }
      return true
    }
  },
  jwt: {
    encryption: true,
    maxAge: 60 * 60 * 24 * 30,
  },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
};





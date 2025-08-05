// import NextAuth from 'next-auth';
// import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
// import clientPromise from './db';
// import GoogleProvider from 'next-auth/providers/google';

// export const authOptions = {
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!,
//     }),
//   ],
//   session: { strategy: 'jwt' },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);

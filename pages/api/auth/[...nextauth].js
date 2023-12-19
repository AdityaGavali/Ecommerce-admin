import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
const AdminEmails = ['aditya.gavali20@pccoepune.org','gavaliaditya1803@gmail.com']
export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Passwordless / email sign in
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
 
  ],
  adapter: MongoDBAdapter(clientPromise),

  callbacks : {
  async signIn(user){
    if(AdminEmails.includes(user?.user?.email)){
      return true;
  }
    else return('/'); 
  }
  
},
pages  :{
  signIn : '/',
}
}
export default NextAuth(authOptions)
export  async  function  isAdminRequest(req,res){
  const session = await  getServerSession(req,res,authOptions);
  
  if(!AdminEmails.includes(session?.user?.email)){
    res.status(401);
    res.end()
    throw 'not an admin';
  }
}


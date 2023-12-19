// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'

import Layout from "@/components/Layout";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// const inter = Inter({ subsets: ['latin'] })

export default function Component() {
  
const {data : session} = useSession();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
      <div className="text-black font-extralight flex gap-2 justify-between">
      <h2 className="font-medium">Hello, <b>{session?.user?.name.substring(0, session?.user?.name.indexOf(' '))}</b></h2>
     <div className="flex bg-gray-300  text-black rounded-lg overflow-hidden ">
    <Image width={25} height={25} src={session?.user?.image} alt="Not found" style={{ borderRadius: '25%' }}/>
    <span className="py-1 px-2">  {session?.user?.name}</span>
  
    </div>
      </div>
     
      <div className="text-black font-extralight text-center mt-8 ">Explore the comprehensive overview of your online business through the dashboard</div>
      
      <div className="flex justify-center gap-2">
        <Link className="bg-highlight p-2 rounded-md border-2 focus:outline-none hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105" href={'/products'}>Manage Products</Link>
        <Link className="bg-highlight p-2 rounded-md border-2 focus:outline-none hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105" href={'/categories'}>Manage Categoires</Link>
      </div>
      </div>
      
    </Layout>
  )
  
}

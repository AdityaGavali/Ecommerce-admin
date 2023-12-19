import Nav from "@/components/Nav";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setshowNav] = useState(false);
  if (!session) {
    return (
      <div className="bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900 w-screen h-screen flex flex-col justify-center items-center ">
      <div  className="group  overflow-hidden bg-gradient-to-bl from-sky-500 via-sky-600 to-sky-800 p-6 rounded-lg  backdrop-filter backdrop-blur-md border border-neutral-600">
        <div className="flex  text-black  font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>{" "}
          EcommerceAdmin
        </div>
        <div className="text-center w-full flex flex-col justify-center items-center">
          <button
            onClick={() => signIn("google")}
            className="bg-white font-medium text-purple-600 w-45 m-2 p-2 px-5 rounded-full focus:outline-none hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Authenticate with Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="bg-white font-medium text-purple-600 w-45  p-2 px-5 rounded-full focus:outline-none hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Authenticate with Github
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray  min-h-screen">
    <div className=" flex items-center   md:hidden p-4 "> 
    <button onClick={() =>setshowNav(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        
      </button>
      <div className="flex grow justify-center mr-6"><Logo/></div>
      </div>
     
      <div className=" flex gap-3">
        <Nav  show = {showNav}/>
        <div className=" flex-grow  p-4">
          {children} <br />
        </div>
      </div>
    </div>
  );
}

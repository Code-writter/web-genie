"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import{
    SignedIn, 
    SignedOut, 
    SignInButton, 
    SignOutButton
} from "@clerk/nextjs"


export default function Navbar(){
    // ! TODO : Fix Its design
    return(
        <nav className=" p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent " >

            <div className="max-w-5xl mx-auto  flex justify-between items-center " >
            <Link  href={"/"} className=" flex items-center gap-2" >
                <Image src={"/logo/logo.svg"} width={24} height={24}   alt="Web-genine-logo"  />
                <span className=" font-semibold text-xl" >
                    Web Genine
                </span>
            </Link>
            </div>

        </nav>
    )
}
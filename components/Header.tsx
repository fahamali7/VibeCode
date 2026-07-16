import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { ArrowRight, Zap } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs'
import { Button } from './ui/button'

const Header = () => {
  return (
    <header className = " w-full fixed top-0 left-0 z-50 h-16 border-b bor-white/6 bg-white/7 backdrop-blur-md">
        <nav className = " mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href = "/">
                <Image
                    src = {"/logo.png"}
                    alt = "Logo" 
                    width = {100}
                    height = {100}
                    className = "h-9 w-auto rounded-md"
                />
            </Link>

            <div className = "flex items-center gap-5">
                <Show when="signed-in">
                    <Link href = { "/projects" }
                    className = " text-white/40 ">
                        Projects
                    </Link>

                    <span className = "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 p-3 text-xs text-white/70">
                        <Zap className = " h-3 w-3 fill-white/70"/>
                        3/40 credits
                    </span>

                <UserButton />
                </Show>

                <Show when="signed-out">
              <SignInButton mode = 'modal'>
                <Button variant = 'ghost' size = 'sm'
                className = ' text-white/40'
                >
                    Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode = 'modal'>
                <Button 
                size = 'sm'
                className="h-8 rounded-full font-semibold active:scale-95 px-3 pt-0.5"
                >
                 Get Started
                 <ArrowRight className = "h-3 w-3 opacity-60"/>
                </Button>
              </SignUpButton>
            </Show>


            </div>
        </nav>
    </header>
  )
}

export default Header
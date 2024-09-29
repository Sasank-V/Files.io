'use client'

import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu } from 'lucide-react'

const Layout = ({
  children
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)


  // 252, 239, 231
  // 249, 217, 198
  // 


  return (
    (<div className="flex flex-col w-[100vw] h-max bg-[rgb(252,239,231)] min-h-screen">
      <header
        className="sticky top-0 z-50 w-[100vw] border-b bg-inherit"
      >
        <div className="p-4 px-10 flex h-14 items-center justify-between w-full">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span className="hidden font-bold sm:inline-block">EduShare</span>
            </Link>
            <nav className="flex ml-10 items-center space-x-6 text-md font-medium">
              <Link to="/">Home</Link>
              <Link to="/learn">Learn</Link>
              <Link to="/queries">Queries</Link>
            </nav>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-controls="radix-:R1mcq:"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          <div
            className="flex flex-1 items-center space-x-3 justify-end">
            {/* <div className="w-full flex-1 md:w-auto md:flex-none">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="pl-8 md:w-[300px] lg:w-[300px]" />
                </div>
              </div> */}
            <Link to="/login">
              <Button variant="outline" className="bg-[#333333] border-0 text-white hover:bg-[#666666] hover:text-white">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="bg-[rgb(255,161,98)] text-white border-0">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <div>
        <div className='flex h-max min-h-[95vh] w-full'>
          <Outlet />
        </div >
      </div>
      <div className='h-[20vh] flex-grow-0 flex w-full bg-black text-white p-10'>
        This is the footer
      </div>
    </div >)
  );
}


export default Layout
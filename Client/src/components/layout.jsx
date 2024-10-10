'use client'

import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Zap, Github, Linkedin } from 'lucide-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { auth } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()
  const zapRef = useRef(null)

  const handleLogout = async () => {
    logout();
    navigate("/login");
  }

  useGSAP(() => {
    gsap.from("#logo", {
      opacity: 0,
      duration: 0.75,
      delay: 0.5,
      x: -50,
      ease: "power4.out",
    })
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleZapHover = () => {
    gsap.to(zapRef.current, {
      scale: 1.2,
      rotation: 20,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleZapLeave = () => {
    gsap.to(zapRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.in",
    })
  }

  return (
    <div className="flex flex-col w-[100vw] h-max bg-[rgb(252,239,231)] min-h-screen font-vssemibold">
      <header className="sticky top-0 z-50 w-[100vw] border-b bg-inherit">
        <div className="p-4 px-10 flex h-14 items-center justify-between w-full border-b-2 border-[#777777]">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span id="logo" className="hidden font-bold sm:inline-block text-lg">Files.io</span>
            </Link>
            <nav className="flex ml-10 items-center space-x-6 text-md font-medium">
              <Link to={auth?.isAdmin ? "/dashboard" : "/"} id='nav'>Home</Link>
              <Link to="/learn" id='nav'>Learn</Link>
              <Link to="/queries" id='nav'>Queries</Link>
            </nav>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
          <div className="flex flex-1 items-center space-x-3 justify-end">
            {!auth.access_token &&
              <>
                <Link to="/login" id='nav'>
                  <Button variant="outline" className="bg-[#333333] border-0 text-white hover:bg-[#666666] hover:text-white">Login</Button>
                </Link>
                <Link to="/signup" id='nav'>
                  <Button variant="outline" className="bg-[rgb(255,161,98)] text-white border-0">Register</Button>
                </Link>
              </>
            }
            {auth.access_token &&
              <Button variant="outline" className="bg-[rgb(255,161,98)] text-white border-0" onClick={handleLogout}>Logout</Button>
            }
            <div
              className="ml-4 cursor-pointer"
              onMouseEnter={handleZapHover}
              onMouseLeave={handleZapLeave}
              aria-label="Quick action"
            >
              <Zap
                ref={zapRef}
                className="h-8 w-8 text-[rgb(255,161,98)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)}></div>
        <nav className="relative flex flex-col h-full w-64 max-w-sm py-6 px-6 bg-white shadow-xl overflow-y-auto">
          <div className="flex items-center mb-8 border-b-2 border-[#777777]">
            <Link className="mr-auto text-lg font-bold" to="/" onClick={() => setIsMenuOpen(false)}>
              Files.io
            </Link>
            <button
              className="p-2 focus:outline-none focus:ring"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-sm" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/learn" className="text-sm" onClick={() => setIsMenuOpen(false)}>Learn</Link>
            <Link to="/queries" className="text-sm" onClick={() => setIsMenuOpen(false)}>Queries</Link>
          </div>
        </nav>
      </div>

      <div>
        <div className='flex h-max min-h-[95vh] w-full'>
          <Outlet />
        </div>
      </div>
      <footer className='h-auto flex-grow-0 flex flex-col justify-center items-center w-full bg-black text-white p-10 space-y-4'>
        <div>Made By <a href='https://github.com/Sasank-V' className="underline">Sasank</a> & <a href='https://github.com/soorajsunil1409' className="underline">Sooraj</a></div>
        <div className="text-lg font-semibold">Contact Us</div>
        <div className="flex space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="font-medium">Sasank V</div>
            <div className="flex space-x-4">
              <a href="https://github.com/Sasank-V" target="_blank" rel="noopener noreferrer" aria-label="Sasank's GitHub">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/sasank-v-a75a58279/" target="_blank" rel="noopener noreferrer" aria-label="Sasank's LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="font-medium">Sooraj Sunil</div>
            <div className="flex space-x-4">
              <a href="https://github.com/soorajsunil1409" target="_blank" rel="noopener noreferrer" aria-label="Sooraj's GitHub">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/sooraj-s-namboothiry-b564a928a/" target="_blank" rel="noopener noreferrer" aria-label="Sooraj's LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="absolute bg-red-100 z-100">
        <ToastContainer />
      </div>
    </div>
  )
}
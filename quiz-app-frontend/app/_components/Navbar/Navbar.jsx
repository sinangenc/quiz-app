'use client'

import { useAuth } from '@/app/_context/AuthContext'
import Link from 'next/link'

export default function Example() {
  const {isLoggedIn, logout, loading, jwtToken} = useAuth()
  return (
    <header>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="text-2xl font-semibold text-gray-600">Quiz App</Link>
        </div>
        
        <div className="flex lg:flex-1 lg:justify-end space-x-4 items-center">
          {!loading && !isLoggedIn && (
          <Link href="/register" className="text-sm text-gray-900 hover:underline">Register</Link>  
          )}
          {!loading && !isLoggedIn && (
          <Link href="/login" className="text-sm text-white bg-primary hover:bg-primaryemphasis transition-all duration-150 rounded-md px-6 py-2.5">
            <span className="mx-2">Login</span>
          </Link> 
          )}
          

          {!loading && isLoggedIn && (
          <button onClick={()=>logout()} className="text-sm text-gray-900 hover:underline">Logout</button>  
          )}
          {!loading && isLoggedIn && (
          <Link href="/dashboard" className="text-sm text-white bg-primary hover:bg-primaryemphasis transition-all duration-150 rounded-md px-6 py-2.5">
            <span className="mx-2">Dashboard</span>
          </Link>
          )}
        </div>   
      </nav>
    </header>

  )
}

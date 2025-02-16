'use client'

import Link from "next/link"
import { useState } from "react"
import isValidEmail from "../_utils/checkEmail"
import { useAuth } from "../_context/AuthContext"
import { useRouter } from "next/navigation"
import PublicRoute from "../_components/PublicRoute/PublicRoute"


export default function LoginPage() {
    const LOGIN_URL = 'http://localhost:8080/auth/login'
    const {login} = useAuth()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const initialErrorTemplate = { email: "", password: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)



    //Submit login form
    function handleSubmit(e) {
        e.preventDefault();

        setError(initialErrorTemplate)
        let isFormValid = true
        
        if (!isValidEmail(email)) {
            setError((prevState) => ({ ...prevState, email: "Please enter a valid email address." }))
            isFormValid = false
        }
        if (!password) {
            setError((prevState) => ({ ...prevState, password: "Password is required." }))
            isFormValid = false
        }

        if (!isFormValid){
            return false
        }


        
        setLoading(true)
        fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then((response) => {
            if (response.status === 200) {
                // 200 means credentials are correct
                return response.json().then((data) => {
                    login(data.token)
                    router.push('/dashboard')
                });
            }
            else if (response.status === 401) {
                // response status is 401, this means invalid credentials
                return response.json().then((data) => {
                    // Set the error message
                    setError((prevState) => ({ ...prevState, general: data.error }));
                });
            }
            else {
                setError((prevState) => ({ ...prevState, general:"An error is occured. Please try again later." }))
            }
        })
        .finally((data) => {
            setLoading(false)
        })
        
    }

    return (
      <PublicRoute>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            {error.general && (
              <div className="w-full text-white bg-red-500">
                  <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                      <div className="flex">
                          <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current">
                              <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z">
                              </path>
                          </svg>
              
                          <p className="mx-3">{error.general}</p>
                      </div>
                  </div>
              </div> 
            )}
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e)=>{
                      setEmail(e.target.value)
                      if (error.email) {
                        setError((prevState) => ({ ...prevState, email: "" }))
                      }
                    }}
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm">{error.email}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e)=>{
                      setPassword(e.target.value)
                      if (error.password) {
                        setError((prevState) => ({ ...prevState, password: "" }))
                      }
                    }}
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
                  />
                  {error.password && (
                    <p className="text-red-500 text-sm">{error.password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link 
                href="/register" 
                className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </PublicRoute>
    )
  }
  
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import isValidEmail from "@/app/_utils/checkEmail"
import { useAuth } from "@/app/_context/AuthContext"
import PublicRoute from "@/app/_components/PublicRoute/PublicRoute"
import ErrorAlert from "@/app/_components/Alert/ErrorAlert"


export default function LoginPage() {

    const LOGIN_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/auth/login'

    const {login} = useAuth()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const initialErrorTemplate = { email: "", password: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)



    //Submit login form
    const handleSubmit = async (e) =>{
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

        setLoading(true);

        try {
          const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
          });

          if (response.status === 200) {
            const data = await response.json();
            login(data.token);
            router.push('/dashboard');
          } else if (response.status === 401) {
            const data = await response.json();
            throw new Error(data.error);
          } else {
            throw new Error("An error is occurred. Please try again later.");
          }

        } catch(err) {
          setError((prevState) => ({ ...prevState, general: err.message }));
        } finally {
          setLoading(false);
        }
    }

    return (
      <PublicRoute>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-5 text-xl text-gray-800 text-center mb-3">Sign in to your account</h3>

            {error.general && <ErrorAlert message={error.general} />}
            
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
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
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
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
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
                  className="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs bg-primary hover:bg-primaryemphasis"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm/6 text-gray-500">
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

/*
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
        */
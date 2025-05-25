'use client'

import Link from "next/link"
import { useState } from "react"
import isValidEmail from "@/app/_utils/checkEmail"
import PublicRoute from "@/app/_components/PublicRoute/PublicRoute"
import ErrorAlert from "@/app/_components/Alert/ErrorAlert"
import SuccessAlert from "@/app/_components/Alert/SuccessAlert"

export default function RegisterPage(){
    const REGISTER_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/auth/register'
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [isNewUserCreated, setIsNewUserCreated] = useState(false)

    const initialErrorTemplate = { name: "", email: "", password: "", confirmPassword: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)
    
    //Submit register form
    const handleSubmit = async (e) =>{
        e.preventDefault();

        setError(initialErrorTemplate)
        let isFormValid = true
        
        if (name.length < 3) {
            setError((prevState) => ({ ...prevState, name: "Name should contain at least 3 characters." }))
            isFormValid = false
        }
        if (!isValidEmail(email)) {
            setError((prevState) => ({ ...prevState, email: "Please enter a valid email address." }))
            isFormValid = false
        }
        if (password.length < 6) {
            setError((prevState) => ({ ...prevState, password: "Password should contain at least 6 characters." }))
            isFormValid = false
        }
        if (password !== confirmPassword) {
            setError((prevState) => ({ ...prevState, confirmPassword: "Passwords don't match." }))
            isFormValid = false
        }

        if (!isFormValid){
            return false
        }

        setLoading(true)

        try {
          const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword })
          });

          if (response.status === 201) {
            setIsNewUserCreated(true)
          } else if (response.status === 409) {
            const data = await response.json();
            throw new Error(data.message);
          } else {
            throw new Error("An error is occurred. Please try again later.");
          }

        } catch(err) {
          setError((prevState) => ({ ...prevState, general: err.message }));
        } finally {
          setLoading(false);
        }
    }

    if(isNewUserCreated){
        return(
        <PublicRoute>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                    <SuccessAlert message="Your account was created! Please log in." />
                </div>
            </div>
        </PublicRoute>
        )
    }


    return(
    <PublicRoute>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-5 text-xl text-gray-800 text-center mb-3">Create a new account</h3>

            {error.general && <ErrorAlert message={error.general} />}
            
            <form className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                    Full Name
                    </label>
                    <div className="mt-2">
                    <input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                        setName(e.target.value);
                        if (error.name) {
                            setError((prevState) => ({ ...prevState, name: "" }));
                        }
                        }}
                        type="text"
                        autoComplete="name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                    />
                    {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                    </label>
                    <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                        setEmail(e.target.value);
                        if (error.email) {
                            setError((prevState) => ({ ...prevState, email: "" }));
                        }
                        }}
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                    />
                    {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                    </label>
                    <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                        setPassword(e.target.value);
                        if (error.password) {
                            setError((prevState) => ({ ...prevState, password: "" }));
                        }
                        }}
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                    />
                    {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                    Confirm Password
                    </label>
                    <div className="mt-2">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error.confirmPassword) {
                            setError((prevState) => ({ ...prevState, confirmPassword: "" }));
                        }
                        }}
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                    />
                    {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs bg-primary hover:bg-primaryemphasis"
                    >
                    {loading ? "Creating account..." : "Register"}
                    </button>
                </div>
            </form>

            <p className="mt-5 text-center text-sm/6 text-gray-500">
                Already have an account?{' '}
                <Link 
                    href="/login" 
                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign in now
                </Link>
                </p>
          </div>
        </div>
    </PublicRoute>
    )
}
'use client'

import Link from "next/link"
import { useState } from "react"
import isValidEmail from "../_utils/checkEmail"
import PublicRoute from "../_components/PublicRoute/PublicRoute"

export default function RegisterPage(){
    const REGISTER_URL = 'http://localhost:8080/auth/register'
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [isNewUserCreated, setIsNewUserCreated] = useState(false)

    const initialErrorTemplate = { name: "", email: "", password: "", confirmPassword: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)
    
    //Submit register form
    function handleSubmit(e) {
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
        fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword }),
        })
        .then((response) => {
            if (response.status === 201) {
                setIsNewUserCreated(true)
            } else if (response.status === 409) {
                return response.json().then((data) => {
                    setError((prevState) => ({ ...prevState, general: data.message }))
                });
            } else {
                setError((prevState) => ({ ...prevState, general:"An error is occured. Please try again later." }))
            }
        })
        .finally((data) => {
            setLoading(false)
        })

        
    }

    if(isNewUserCreated){
        return(
        <PublicRoute>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                    
                    <div className="w-full text-white bg-green-500">
                        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                            <div className="flex">
                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                            </svg>
                    
                                <p className="mx-3">Your account was created! Please log in.</p>
                            </div>
                        </div>
                    </div> 

                </div>
            </div>
        </PublicRoute>
        )
    }


    return(
    <PublicRoute>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Create a new account
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400"
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
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500"
                    >
                    {loading ? "Creating account..." : "Register"}
                    </button>
                </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
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
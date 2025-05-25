'use client'

import { useEffect } from "react"
import { useAuth } from "@/app/_context/AuthContext"

export default function DashboardPage(){
    const { jwtToken, userProfile, setUserProfile, logout } = useAuth()
    const USER_INFO_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/me'
    

    return(
        <div className="bg-white p-6 rounded-lg shadow text-gray-800 text-lg font-semibold">Hello {userProfile.name}!</div>
    )
    
}
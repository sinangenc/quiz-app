'use client'

import { useAuth } from "@/app/_context/AuthContext"
import DashboardQuizResults from "@/app/_components/DashboardQuizResults/DashboardQuizResults"

export default function DashboardPage(){
    const { userProfile } = useAuth()
    

    return(
        <>
            <div className="bg-white p-6 rounded-lg shadow text-gray-800 text-lg font-semibold">Hello {userProfile.name}!</div>
            <DashboardQuizResults />
        </>
    )
    
}
'use client'

import { useEffect } from "react"
import { useAuth } from "@/app/_context/AuthContext"

export default function DashboardPage(){
    const { jwtToken, userProfile, setUserProfile, logout } = useAuth()
    const USER_INFO_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/me'
    
    
    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(USER_INFO_URL, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });

                if(response.status === 200) {
                    const data = await response.json();
                    setUserProfile(data);

                } else if (response.status === 401) {
                    logout();
                }else {
                    throw new Error('An error occurred. Please try again later.');
                }

            } catch (err){ 
                console.log(err.message)
            }
        }

        if(jwtToken){
            fetchUserProfile();
        }

    }, [jwtToken]);
    
    

    return(
        <div className="bg-white p-6 rounded-lg shadow text-gray-800 text-lg font-semibold">Hello {userProfile.name}!</div>
    )
    
}
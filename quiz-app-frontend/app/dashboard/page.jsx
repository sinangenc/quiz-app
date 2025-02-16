'use client'

import { useEffect } from "react"
import { useAuth } from "../_context/AuthContext"
import PrivateRoute from "../_components/PrivateRoute/PrivateRoute"


export default function DashboardPage(){
    const { jwtToken, userProfile, setUserProfile, logout } = useAuth()
    const USER_INFO_URL = 'http://localhost:8080/users/me'

    
    useEffect(()=>{
        if(jwtToken){
            fetch(USER_INFO_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json().then((data) => {
                        setUserProfile(data)
                    });
                }
                else if(response.status === 401){
                    logout();
                }
                else{
                    // change with alert
                    console.error("An error is occured. Please try again later.");
                }
            })
        }
    }, [jwtToken])
    

    return(
        <PrivateRoute>
            <section className="bg-white dark:bg-gray-900">
                <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
                    Hello {userProfile.name}!
                    </h2>



                    <div className="mt-6">
                        <button
                            onClick={()=>alert("Not yet implemented!")}
                            className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-amber-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-amber-500 ">
                            <span className="mx-2">
                            Update Personal Infos
                            </span>
                        </button>
                        <button
                            onClick={()=>alert("Not yet implemented!")}
                            className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-cyan-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-cyan-500">
                            <span className="mx-2">
                            Change Password
                            </span>
                        </button>
                    </div>

                
                </div>
            </section>
        </PrivateRoute>
    )
    
}
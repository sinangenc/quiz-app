'use client'

import { useState, useEffect, createContext, useContext } from "react"
import Loading from "@/app/_components/Loading/Loading"


const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({});

    const USER_PROFILE_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/me';

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(USER_PROFILE_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('UserProfile fetch error!');
            }

            const data = await response.json();
            setUserProfile(data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setJwtToken(token);
            fetchUserProfile(token);
        } else{
            setLoading(false);
        }
    }, []);

   const isLoggedIn = jwtToken !== null && userProfile !== null;

    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        setJwtToken(token);
        fetchUserProfile(token);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setJwtToken(null);
        setUserProfile(null);
    };

     if(loading){
            return <Loading />
        }

    return (
        <AuthContext.Provider value={{ isLoggedIn, jwtToken, userProfile, setUserProfile, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
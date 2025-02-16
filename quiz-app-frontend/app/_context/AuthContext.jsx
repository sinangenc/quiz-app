'use client'

import { useState, useEffect, createContext, useContext } from "react"

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setJwtToken(token);
        }
        setLoading(false)
    }, []);

    const isLoggedIn = jwtToken !== null;

    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        setJwtToken(token);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setJwtToken(null);
    };

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
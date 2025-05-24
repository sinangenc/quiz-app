import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from "../Loading/Loading"


const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth()
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, loading, router]);


     if(loading){
        return <Loading />
    }

    if (!isLoggedIn) {
        return children;
    }
};

export default PublicRoute;
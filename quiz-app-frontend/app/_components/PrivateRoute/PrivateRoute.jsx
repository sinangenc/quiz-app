import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth()
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, loading, router]);


    if (loading) {
        return false;
    }

    if (isLoggedIn) {
        return children;
    }
    
};

export default PrivateRoute;

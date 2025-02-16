import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth()
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, loading, router]);


    if (loading) {
        return <p>Loading</p>;
    }

    if (!isLoggedIn) {
        return children;
    }
};

export default PublicRoute;
'use client'
import { useState, useEffect } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import PrivateRoute from "@/app/_components/PrivateRoute/PrivateRoute"
import ErrorAlert from "@/app/_components/Alert/ErrorAlert"
import SuccessAlert from "@/app/_components/Alert/SuccessAlert"

export default function UpdateProfilePage(){
    const { jwtToken, userProfile, setUserProfile, logout} = useAuth()
    const USER_PROFILE_UPDATE_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/me'


    const [name, setName] = useState('');
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('')


    useEffect(() => {
        if (userProfile && userProfile.email) {
            setName(userProfile.name || '');
        }
    }, [userProfile]);


    // Güncelleme işlemi
    const handleUpdate = async (e) => {
        e.preventDefault();

        setUpdating(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(USER_PROFILE_UPDATE_URL, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` 
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                // Handle expired sessions
                if(res.status === 401){
                    logout();
                }
                
                throw new Error('Failed to update profile!');
            }

            setUserProfile({...userProfile, name: name})
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdating(false);
        }
    };
    
    return (
        <PrivateRoute>
            <div className="mx-auto p-6 bg-white rounded-lg shadow text-gray-800">
                <h1 className="text-xl font-semibold mb-4">Update Profile</h1>

                {error && <ErrorAlert message={error}/>}
                {success && <SuccessAlert message={success}/>}
                
                <form>
                    <label className="block mb-4">
                        Email:
                        <input
                        type="email"
                        className="block w-full rounded-md px-3 py-2 mt-1 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none bg-gray-200 disabled:opacity-60 disabled:pointer-events-none"
                        value={userProfile.email}
                        disabled={true}
                        />
                    </label>

                    <label className="block mb-2">
                        Name:
                        <input
                        type="text"
                        className="block w-full rounded-md bg-white px-3 py-2 mt-1 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <button
                        type="submit"
                        onClick={handleUpdate}
                        disabled={updating}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                    >
                        {updating ? 'Updating...' : 'Update'}
                    </button>
                </form>
            </div>
        </PrivateRoute>
       
    );
}
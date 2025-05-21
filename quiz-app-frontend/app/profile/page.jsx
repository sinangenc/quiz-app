'use client'
import { useState, useEffect } from "react"
import { useAuth } from "../_context/AuthContext"
import PrivateRoute from "../_components/PrivateRoute/PrivateRoute"

export default function ProfilePage(){
    const { jwtToken, userProfile, setUserProfile, logout } = useAuth()
    const USER_PROFILE_URL = 'http://localhost:8080/users/me'


    const [name, setName] = useState('');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');


    useEffect(() => {
        if (userProfile && userProfile.email) {
            setName(userProfile.name || '');
        }
    }, [userProfile]);


    // Güncelleme işlemi
    const handleUpdate = async () => {
        setUpdating(true);
        setMessage('');

        try {
            const res = await fetch(USER_PROFILE_URL, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` 
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error('Update failed');
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    return (
        
        <PrivateRoute>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Update Profile</h1>

                {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
                <label className="block mb-4">
                    Email:
                    <input
                    type="email"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    value={userProfile.email}
                    disabled={true}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label className="block mb-2">
                    Name:
                    <input
                    type="text"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                >
                    {updating ? 'Updating...' : 'Update'}
                </button>
                </div>
        </PrivateRoute>
    )
}
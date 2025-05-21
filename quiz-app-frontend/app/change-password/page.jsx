'use client'
import { useState, useEffect } from "react"
import { useAuth } from "../_context/AuthContext"
import PrivateRoute from "../_components/PrivateRoute/PrivateRoute"

export default function ProfilePage(){
    const { jwtToken, userProfile, setUserProfile, logout } = useAuth()
    const USER_PASSWORD_UPDATE_URL = 'http://localhost:8080/users/me/password'


    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [updating, setUpdating] = useState(false);
    const initialErrorTemplate = { oldPassword: "", newPassword: "", confirmPassword: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)



    // Güncelleme işlemi
    const handleChangePassword = async () => {
        setError(initialErrorTemplate)
        let isFormValid = true
        
        if (oldPassword.length < 6) {
            setError((prevState) => ({ ...prevState, oldPassword: "Password should contain at least 6 characters." }))
            isFormValid = false
        }
        if (newPassword.length < 6) {
            setError((prevState) => ({ ...prevState, newPassword: "Password should contain at least 6 characters." }))
            isFormValid = false
        }
        if (newPassword !== confirmPassword) {
            setError((prevState) => ({ ...prevState, confirmPassword: "Passwords don't match." }))
            isFormValid = false
        }

        if (!isFormValid){
            console.log(error)
            return false
        }
        
        setUpdating(true);

        try {
            const res = await fetch(USER_PASSWORD_UPDATE_URL, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` 
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!res.ok) {
                const errorData = await res.json();  // Hata mesajını çekiyoruz
                throw new Error(errorData.message || 'Update failed');
            }

            setError((prevState) => ({ ...prevState, general: 'Password updated successfully!' }));
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError((prevState) => ({ ...prevState, general: err.message }))
        } finally {
            setUpdating(false);
        }
    };

    return (
        
        <PrivateRoute>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Change Password</h1>

                {error.general && <p className="mb-4 text-sm text-red-500">{error.general}</p>}
                <label className="block mb-4">
                    Current Password:
                    <input
                    type="password"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    value={oldPassword}
                    onChange={(e) => {
                        setOldPassword(e.target.value)
                        if (error.oldPassword) {
                            setError((prevState) => ({ ...prevState, oldPassword: "" }));
                        }
                    }}
                    />
                    {error.oldPassword && <p className="text-red-500 text-sm">{error.oldPassword}</p>}
                </label>

                <label className="block mb-4">
                    New Password:
                    <input
                    type="password"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (error.newPassword) {
                            setError((prevState) => ({ ...prevState, newPassword: "" }));
                        }
                    }}
                    />
                    {error.newPassword && <p className="text-red-500 text-sm">{error.newPassword}</p>}
                </label>

                <label className="block mb-4">
                    Confirm New Password:
                    <input
                    type="password"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (error.confirmPassword) {
                            setError((prevState) => ({ ...prevState, confirmPassword: "" }));
                        }
                    }}
                    />
                    {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
                </label>

                <button
                    onClick={handleChangePassword}
                    disabled={updating}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                >
                    {updating ? 'Updating...' : 'Change Password'}
                </button>
                </div>
        </PrivateRoute>
    )
}
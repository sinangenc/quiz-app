'use client'
import { useState } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import PrivateRoute from "@/app/_components/PrivateRoute/PrivateRoute"
import ErrorAlert from "@/app/_components/Alert/ErrorAlert"
import SuccessAlert from "@/app/_components/Alert/SuccessAlert"


export default function ProfilePage(){
    const { jwtToken, logout } = useAuth()
    const USER_PASSWORD_UPDATE_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/me/password'

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [updating, setUpdating] = useState(false);
    const initialErrorTemplate = { oldPassword: "", newPassword: "", confirmPassword: "", general: "" }
    const [error, setError] = useState(initialErrorTemplate)
    const [success, setSuccess] = useState('')

    // Update Handler
    const handleChangePassword = async (e) => {
        e.preventDefault();

        setError(initialErrorTemplate)
        setSuccess('')
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
                
                // Handle expired sessions
                if(res.status === 401){
                    logout();
                }

                const errorData = await res.json();
                throw new Error(errorData.message);
            }

            setSuccess('Password updated successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError((prevState) => ({ ...prevState, general: err.message}))
        } finally {
            setUpdating(false);
        }
    };

    return (
        
        <PrivateRoute>
            <div className="mx-auto p-6 bg-white rounded-lg shadow text-gray-800">
                <h1 className="text-xl font-semibold mb-4">Change Password</h1>

                {error.general && <ErrorAlert message={error.general}/>}
                {success && <SuccessAlert message={success}/>}
                
                <form>
                    <label className="block mb-4">
                        Current Password:
                        <input
                        type="password"
                        className="block w-full rounded-md bg-white px-3 py-2 mt-1 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
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
                        className="block w-full rounded-md bg-white px-3 py-2 mt-1 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
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
                        className="block w-full rounded-md bg-white px-3 py-2 mt-1 text-base text-gray-900 border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none"
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
                        type="submit"
                        onClick={handleChangePassword}
                        disabled={updating}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                    >
                        {updating ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </PrivateRoute>
    )
}
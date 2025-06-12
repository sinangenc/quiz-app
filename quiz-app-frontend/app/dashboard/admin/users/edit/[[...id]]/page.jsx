'use client'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import PrivateRoute from '@/app/_components/PrivateRoute/PrivateRoute'
import ErrorAlert from '@/app/_components/Alert/ErrorAlert'
import SuccessAlert from '@/app/_components/Alert/SuccessAlert'
import Link from 'next/link'
import Loading from "@/app/_components/Loading/Loading"

export default function AdminUsersEditPage() {
    const { id } = useParams()
    const isEditMode = !!id
    const { jwtToken, logout } = useAuth()
    const router = useRouter()

    const searchParams = useSearchParams()
    const successParam = searchParams.get('success')

    const [isReady, setIsReady] = useState(isEditMode ? false : true)

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const USER_API_URL = `${BASE_URL}/admin/users${isEditMode ? `/${id}` : ''}`

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [active, setActive] = useState(true)
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(successParam === 'true' ? 'User created successfully!' : '')

    // Get states list
    useEffect(() => {
        fetch(`${BASE_URL}/admin/users/roles`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(res => {
            if (res.status === 401) logout()
            if (!res.ok) throw new Error('Failed to fetch roles.')
            return res.json()
        })
        .then(data => setRoles(data))
        .catch(err => setError(err.message))
    }, [jwtToken])
    
    // Get user details for edit mode
    useEffect(() => {
        if (isEditMode) {
            setLoading(true)
            fetch(USER_API_URL, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            .then(res => {
                if (res.status === 401) logout()
                if (!res.ok) {
                    router.push('/dashboard/admin/users')
                    return
                }
                return res.json()
            })
            .then(data => {
                setName(data.name || '')
                setEmail(data.email || '')
                setActive(data.active)
                setRole(data.role || 'USER')
                setIsReady(true)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
        }
    }, [id, jwtToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            setLoading(false)
            return
        }

        try {
            const userObj = {
                name,
                email,
                active,
                role,
                ...(password && { password }),
                ...(password && { confirmPassword }),
            }

            const response = await fetch(USER_API_URL, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(userObj)
            })

            if (response.status === 401) {
                logout()
                return
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to save user.')
            }

            if (!isEditMode) {
                const location = response.headers.get('Location')
                const newId = location.split('/').pop()
                router.replace(`/dashboard/admin/users/edit/${newId}?success=true`)
            }

            setSuccess(isEditMode ? 'User updated successfully!' : 'User created successfully!')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    if(!isReady){
            return <Loading />
    }

    return (
        <PrivateRoute>
            {error && <ErrorAlert message={error} />}
            {success && <SuccessAlert message={success} />}
            <div className="mx-auto p-6 bg-white rounded-lg shadow text-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold mb-4">
                        {isEditMode ? `Edit User: ${id}` : 'Create New User'}
                    </h1>
                    {isEditMode &&
                    <Link 
                        href="/dashboard/admin/users/edit"
                        className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-500 transition"
                    >
                        New User
                    </Link>}
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        />
                    </label>
                    
                    <label className="block mb-4">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        />
                    </label>

                    {!isEditMode && (
                        <>
                            <label className="block mb-4">
                                Password:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                                    required
                                />
                            </label>

                            <label className="block mb-4">
                                Confirm Password:
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                                    required
                                />
                            </label>
                        </>
                    )}



                    <div className="mb-4">
                        <label className="block mb-2 ">Role:</label>
                        <div className="flex gap-6">
                            {roles.map((r) => (
                                <label key={r.name} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r.name}
                                        checked={role === r.name}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-5 h-5 text-indigo-600"
                                        required
                                    />
                                    <span>{r.description}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 ">Status:</label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="h-5 w-5 text-indigo-600"
                            />
                            <span>Active</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
                    </button>
                </form>
            </div>
        </PrivateRoute>
    )
}
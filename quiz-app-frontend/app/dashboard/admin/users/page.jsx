'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import Loading from "@/app/_components/Loading/Loading"
import Link from 'next/link';
import { FaCheck, FaTimes, FaTrashAlt, FaEdit, FaKey } from 'react-icons/fa';
import Pagination from "@/app/_components/Pagination/Pagination";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ErrorAlert from '@/app/_components/Alert/ErrorAlert'
import SuccessAlert from '@/app/_components/Alert/SuccessAlert'
import { useRouter, useSearchParams } from 'next/navigation'


export default function AdminUsersPage(){
    const router = useRouter()
    const searchParams = useSearchParams()

    const { jwtToken, logout} = useAuth()
    const USERS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/admin/users'
    

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 20;

    const pageFromUrl = parseInt(searchParams.get('page') || '0', 10);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [openDialog, setOpenDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const [openActivateDialog, setOpenActivateDialog] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);


    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordUserId, setPasswordUserId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');



    // Get data
    const fetchUsers = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(`${USERS_URL}?page=${currentPage}&size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                // Handle expired sessions
                if(response.status === 401){
                    logout();
                }
                throw new Error("Users could not retrieved...");
            }

            const userResults = await response.json();
            setUsers(userResults.content);
            setTotalPages(userResults.totalPages);
            setCurrentPage(userResults.number);

            setLoading(false);
        } catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const newPage = parseInt(searchParams.get('page') || '0', 10)
        if (newPage !== currentPage) {
        setCurrentPage(newPage)
        }
    }, [searchParams])

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            router.replace(`?page=${page}`, { scroll: false });
        }
    }

    const handleDelete = (id) => {
        setUserIdToDelete(id);
        setOpenDialog(true);
    }

    const confirmDelete = async () => {
        if (!userIdToDelete) return;

        try {
            setError('');
            setSuccess('');

            const response = await fetch(`${USERS_URL}/${userIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to delete user.');
            }

            setSuccess('User deleted successfully!');
            // Remove deleted item from table
            setUsers(prev => prev.filter(q => q.id !== userIdToDelete));

        } catch (err) {
            setError(err.message);
        } finally {
            setOpenDialog(false);
            setUserIdToDelete(null);
        }
    };

    const closeModal = () => {
        setOpenDialog(false);
        setUserIdToDelete(null);
    }

    const toggleActiveConfirm = (userId, currentStatus) => {
        setUserToToggle({ id: userId, active: currentStatus });
        setOpenActivateDialog(true);
    };

    const confirmToggleActive = async () => {
        if (!userToToggle) return;

        try {
            const { id, active } = userToToggle;
            const url = `${USERS_URL}/${id}/${active ? 'deactivate' : 'activate'}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) throw new Error('Failed to update status');

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === id ? { ...u, active: !active } : u
                )
            );
            setSuccess(`User ${active ? 'deactivated' : 'activated'} successfully!`);
        } catch (err) {
            setError(err.message);
        } finally {
            setOpenActivateDialog(false);
            setUserToToggle(null);
        }
    };

    const closeToggleDialog = () => {
        setOpenActivateDialog(false);
        setUserToToggle(null);
    };


    const handlePasswordChange = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!newPassword || !confirmPassword) {
            setPasswordError("Password and confirmation are required.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password should contain at least 6 chracters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${USERS_URL}/${passwordUserId}/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword, confirmPassword })
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                const result = await response.json();
                setPasswordError(result.message || 'Failed to change password.');
                return;
            }
            setNewPassword('');
            setConfirmPassword('');
            setPasswordSuccess("Password changed successfully.");
            setTimeout(() => {
                setOpenPasswordDialog(false);
            }, 4000);
        } catch (err) {
            setPasswordError("Unexpected error occurred.");
        }
    };


    const createUserTypeLabel = (userType) => {
        if ( userType === 'ADMIN') {
            return(
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightsuccess text-success"><span>Admin</span></span>
            )
        }else{
            return (
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightwarning text-warning"><span>Normal User</span></span>
            )
        }
    }

    if(loading){
        return <Loading />
    }

    return (
    <>
        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        <div className="bg-white p-6 rounded-lg shadow text-gray-800 text-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Users</h2>
                <Link 
                    href="/dashboard/admin/users/edit"
                    className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-500 transition"
                >
                    New User
                </Link>
            </div>

            <table className="overflow-hidden w-full text-left text-sm text-gray-500 mt-3">
                <thead className="group/head text-sm font-medium capitalize text-dark border-b border-ld">
                <tr>
                    <th className="text-left px-4 py-4 font-semibold">ID</th>
                    <th className="text-left px-4 py-4">Name</th>
                    <th className="text-left px-4 py-4">Email</th>
                    <th className="text-left px-4 py-4">Role</th>
                    <th className="text-left px-4 py-4">Active</th>
                    <th className="text-left px-4 py-4">Action</th>
                </tr>
                </thead>
                <tbody>
                {users?.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{createUserTypeLabel(user.role)}</td>
                    <td className="px-4 py-2 text-left">
                        <button
                            onClick={() => toggleActiveConfirm(user.id, user.active)}
                            title={user.active ? "Deactivate User" : "Activate User"}
                        >
                            {user.active ? (
                                <FaCheck size={18} className="text-green-600 cursor-pointer" />
                            ) : (
                                <FaTimes size={18} className="text-red-600 cursor-pointer" />
                            )}
                        </button>
                    </td>
                    <td className="px-4 py-2 flex space-x-4">
                        <Link href={`/dashboard/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-800">
                            <FaEdit size={18} />
                        </Link>
                        <button
                            onClick={() => {
                                setPasswordUserId(user.id);
                                setOpenPasswordDialog(true);
                                setNewPassword('');
                                setConfirmPassword('');
                                setPasswordError('');
                                setPasswordSuccess('');
                            }}
                            className="text-yellow-600 hover:text-yellow-800"
                            aria-label="Change Password"
                            title="Change Password"
                        >
                            <FaKey size={18} />
                        </button>

                        <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete"
                        >
                            <FaTrashAlt size={18} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />


            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={closeModal} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <ExclamationTriangleIcon className="size-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 sm:ml-4 sm:mt-0 text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        Are you sure you want to delete this user?
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={confirmDelete}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            
            {/* Activate/Deactivate Confirmation Dialog */}
            <Dialog open={openActivateDialog} onClose={closeToggleDialog} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:size-10">
                                    <ExclamationTriangleIcon className="size-6 text-yellow-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 sm:ml-4 sm:mt-0 text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        Are you sure you want to {userToToggle?.active ? 'deactivate' : 'activate'} this user?
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            This action will change the user’s active status.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={confirmToggleActive}
                                    className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 sm:ml-3 sm:w-auto"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={closeToggleDialog}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            
            {/* Password Change Dialog */}
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">Change Password</DialogTitle>
                            {passwordError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                                    {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                                    {passwordSuccess}
                                </div>
                            )}
                            <div className="mt-4 space-y-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="mt-5 sm:flex sm:flex-row-reverse gap-2">
                                <button
                                    onClick={handlePasswordChange}
                                    className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setOpenPasswordDialog(false)}
                                    className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>



        </div>  
    </> 
    )
}
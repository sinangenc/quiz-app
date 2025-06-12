'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import Loading from "@/app/_components/Loading/Loading"
import Link from 'next/link';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Pagination from "@/app/_components/Pagination/Pagination";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ErrorAlert from '@/app/_components/Alert/ErrorAlert'
import SuccessAlert from '@/app/_components/Alert/SuccessAlert'
import { useRouter, useSearchParams } from 'next/navigation'


export default function AdminQuestionsPage(){
    const router = useRouter()
    const searchParams = useSearchParams()

    const { jwtToken, logout} = useAuth()
    const QUESTIONS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/admin/questions'
    

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 20;

    const pageFromUrl = parseInt(searchParams.get('page') || '0', 10);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [openDialog, setOpenDialog] = useState(false);
    const [questionIdToDelete, setQuestionIdToDelete] = useState(null);


    // Get data
    const fetchQuestions = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(`${QUESTIONS_URL}?page=${currentPage}&size=${pageSize}`, {
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
                throw new Error("Results could not retrieved...");
            }

            const questionResults = await response.json();
            setQuestions(questionResults.content);
            setTotalPages(questionResults.totalPages);
            setCurrentPage(questionResults.number);

            setLoading(false);
        } catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchQuestions(currentPage);
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
        setQuestionIdToDelete(id);
        setOpenDialog(true);
    }

    const confirmDelete = async () => {
        if (!questionIdToDelete) return;

        try {
            setError('');
            setSuccess('');

            const response = await fetch(`${QUESTIONS_URL}/${questionIdToDelete}`, {
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
                throw new Error('Failed to delete question.');
            }

            setSuccess('Question deleted successfully!');
            // Remove deleted question from table
            setQuestions(prev => prev.filter(q => q.id !== questionIdToDelete));

        } catch (err) {
            setError(err.message);
        } finally {
            setOpenDialog(false);
            setQuestionIdToDelete(null);
        }
    };


    const closeModal = () => {
        setOpenDialog(false);
        setQuestionIdToDelete(null);
    }

    const createQuestionTypeLabel = (questionType) => {
        if (questionType == null || questionType === '') {
            return(
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightsuccess text-success"><span>Normal</span></span>
            )
        }else{
            return (
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightwarning text-warning"><span>Image{console.log(questionType)}</span></span>
            )
        }
    }

    const truncateQuestionText = (text, maxLength = 50) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;


    if(loading){
        return <Loading />
    }

    return (
    <>
        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        <div className="bg-white p-6 rounded-lg shadow text-gray-800 text-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Questions</h2>
                <Link 
                    href="/dashboard/admin/questions/edit"
                    className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-500 transition"
                >
                    New Question
                </Link>
            </div>

            <table className="overflow-hidden w-full text-left text-sm text-gray-500 mt-3">
                <thead className="group/head text-sm font-medium capitalize text-dark border-b border-ld">
                <tr>
                    <th className="text-left px-4 py-4 font-semibold">ID</th>
                    <th className="text-left px-4 py-4">Question</th>
                    <th className="text-left px-4 py-4">State</th>
                    <th className="text-left px-4 py-4">Type</th>
                    <th className="text-left px-4 py-4">Action</th>
                </tr>
                </thead>
                <tbody>
                {questions?.map((question) => (
                    <tr key={question.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{question.id}</td>
                    <td className="px-4 py-2">{truncateQuestionText(question.questionText)}</td>
                    <td className="px-4 py-2">
                        {question.state ?? 'General'}
                    </td>
                    <td className="px-4 py-2">{createQuestionTypeLabel(question.imagePath)}</td>
                    <td className="px-4 py-2 flex space-x-4">
                        <Link href={`/dashboard/admin/questions/edit/${question.id}`} className="text-blue-600 hover:text-blue-800">
                            <FaEdit size={18} />
                        </Link>
                        <button
                            onClick={() => handleDelete(question.id)}
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


            {/* Confirmation Dialog */}
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
                                        Are you sure you want to delete this question?
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

        </div>  
    </> 
    )
}
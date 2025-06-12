'use client'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import PrivateRoute from '@/app/_components/PrivateRoute/PrivateRoute'
import ErrorAlert from '@/app/_components/Alert/ErrorAlert'
import SuccessAlert from '@/app/_components/Alert/SuccessAlert'
import Link from 'next/link'
import Loading from "@/app/_components/Loading/Loading"

export default function AdminQuestionsEditPage() {
    const { id } = useParams()
    const isEditMode = !!id
    const { jwtToken, logout } = useAuth()
    const router = useRouter()

    const searchParams = useSearchParams()
    const successParam = searchParams.get('success')

    const [isReady, setIsReady] = useState(isEditMode ? false : true)

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const QUESTION_API_URL = `${BASE_URL}/admin/questions${isEditMode ? `/${id}` : ''}`

    const [stateOptions, setStateOptions] = useState([]);

    const [questionText, setQuestionText] = useState('')
    const [state, setState] = useState('')
    const [answers, setAnswers] = useState([
        { answerText: '', correct: false },
        { answerText: '', correct: false },
        { answerText: '', correct: false },
        { answerText: '', correct: false }
    ])
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);



    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(successParam === 'true' ? 'Question created successfully!' : '')


    // Get states list
    useEffect(() => {
        fetch(`${BASE_URL}/states`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch states');
                return res.json();
            })
            .then(data => setStateOptions(data))
            .catch(err => setError(err.message))
    }, [])

    
    // Get question details for edit mode
    useEffect(() => {
        if (isEditMode) {
            setLoading(true)
            fetch(QUESTION_API_URL, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    if (!res.ok) {
                        router.push('/dashboard/admin/questions');
                        return;
                    }

                    return res.json()
                })
                .then(data => {
                    setQuestionText(data.questionText || '')
                    setState(data.state || '')
                    setImage(data.imagePath || '')
                    setAnswers(data.answers.map(a => ({ answerText: a.answerText, correct: a.correct })))

                    setIsReady(true)
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false))
        }
    }, [id, jwtToken])

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers]
        updatedAnswers[index][field] = field === 'correct' ? value === 'true' : value
        setAnswers(updatedAnswers)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            // DTO objesi
            const questionObj = {
                questionText,
                state: state || null,
                answers
            }

            // FormData oluştur
            const formData = new FormData()
            formData.append('question', new Blob([JSON.stringify(questionObj)], { type: 'application/json' }));

            if (image && typeof image !== 'string') {
            formData.append('image', image);
            }

            if (imageRemoved) {
            formData.append('removeImage', 'true');
            }




            const response = await fetch(QUESTION_API_URL, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                //    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData
                //body: JSON.stringify({
                //    questionText,
                //    state: state || null,
                 //   answers
                //})
            })

            if (response.status === 401) {
                logout();
                return
            }

            if (!response.ok) throw new Error('Failed to save question.')

            if (!isEditMode) {
                // new entity created
                const location = response.headers.get('Location')
                const newId = location.split('/').pop()
                router.replace(`/dashboard/admin/questions/edit/${newId}?success=true`)
            }

            setSuccess(isEditMode ? 'Question updated successfully!' : 'Question created successfully!')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddAnswer = () => {
        setAnswers([...answers, { answerText: '', correct: false }])
    }

    const handleRemoveAnswer = (indexToRemove) => {
        const updated = answers.filter((_, i) => i !== indexToRemove)

        // Eğer silinen doğru cevapsa, ilk cevabı doğru yap
        if (answers[indexToRemove].correct && updated.length > 0) {
            updated[0].correct = true
        }

        setAnswers(updated)
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
                        {isEditMode ? `Edit: Question ${id}` : 'Create New Question'}
                    </h1>
                    {isEditMode &&
                    <Link 
                        href="/dashboard/admin/questions/edit"
                        className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-500 transition"
                    >
                        New Question
                    </Link>
                    }
                </div>
                


                <form onSubmit={handleSubmit}>
                    {image && typeof image === 'string' && !imageRemoved && (
                    <div className="mb-4">
                        <p className="mb-1 font-semibold">Current Image:</p>
                        <img 
                        src={image} 
                        alt="Current Question Image" 
                        className="max-w-xs max-h-48 object-contain border rounded" 
                        />
                        <button 
                        type="button"
                        onClick={() => {
                            setImage(null);
                            setImageRemoved(true);
                        }}
                        className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500"
                        >
                        Remove Image
                        </button>
                    </div>
                    )}

                    {imagePreview && (
                    <div className="mb-4">
                        <p className="mb-1 font-semibold">Preview:</p>
                        <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="max-w-xs max-h-48 object-contain border rounded"
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                setImage(null);
                                setImageRemoved(true);
                                setImagePreview(null);
                            }}
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500"
                        >
                            Remove Image
                        </button>
                    </div>
                    )}


                    {(!image || typeof image !== 'string' || imageRemoved) && (
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Upload Image (optional):</label>
                        
                        <div className="flex items-center gap-4">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 transition"
                        >
                        Choose Image
                        </label>
                        
                        <span className="text-gray-600 text-sm">
                            {image?.name || 'No file chosen'}
                        </span>
                        </div>

                        <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImage(file);
                                setImageRemoved(false);

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setImagePreview(reader.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="hidden"
                        />
                    </div>
                    )}

                    <label className="block mb-2">
                        Question Text:
                        <textarea
                            className="block w-full rounded-md px-3 py-2 mt-1 border border-gray-300 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        State (optional):
                        <select
                            className="mt-1 block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        >
                            <option value="">-- Select State --</option>
                            {stateOptions.map((opt) => (
                            <option key={opt.code} value={opt.code}>
                                {opt.name}
                            </option>
                            ))}
                        </select>
                    </label>

                    <h2 className="text-md font-semibold mt-4 mb-2">Answers</h2>
                    <button
                        type="button"
                        onClick={handleAddAnswer}
                        className="mb-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition"
                    >
                        + Add Answer
                    </button>
                    
                    {answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-4 mb-2">
                            <input
                            type="radio"
                            name="correctAnswer"
                            checked={answer.correct}
                            onChange={() => {
                                const updated = answers.map((a, i) => ({
                                ...a,
                                correct: i === index
                                }))
                                setAnswers(updated)
                            }}
                            className="h-5 w-5 text-indigo-600"
                            />
                            <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={answer.answerText}
                            onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                            required
                            placeholder={`Answer ${index + 1}`}
                            />
                            <button
                            type="button"
                            onClick={() => handleRemoveAnswer(index)}
                            className="text-red-500 hover:text-red-700 text-lg font-semibold"
                            title="Remove answer"
                            >
                            ✕
                            </button>
                        </div>
                    ))}


                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
                    </button>
                </form>
            </div>
        </PrivateRoute>
    )
}
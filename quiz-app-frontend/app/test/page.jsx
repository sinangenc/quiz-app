'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Timer from "@/app/_components/Timer/Timer"
import Loading from "@/app/_components/Loading/Loading"


export default function Test(){

    const QUESTIONS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/test/BERLIN'
    const CHECK_QUESTIONS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/test/check'
    const { jwtToken } = useAuth()

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);

    const [isFinished, setIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    const [reviewMode, setReviewMode] = useState(false);
    const [reviewResults, setReviewResults] = useState([]);
    
    
    // Open the confirmation modal when the Finish Test button is clicked
    const finishTest = () => setOpenDialog(true)

    // Handle closing the confirmation modal
    const closeModal = () => {
        if(!checkLoading){
            setOpenDialog(false)
        }
    }

    const confirmFinishTest = async () => {
        setCheckLoading(true)
        
        try {
            const headers = {
            'Content-Type': 'application/json',
            };

            if (jwtToken) {
            headers['Authorization'] = `Bearer ${jwtToken}`;
            }

            const response = await fetch(CHECK_QUESTIONS_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ answers })
            });
        
            if (!response.ok) {
                throw new Error("Answers could not retrieved...");
            }

            const data = await response.json();
            setReviewResults(data.questions);
            setCorrectAnswers(data.numberOfCorrectAnswers);
            setIncorrectAnswers(data.numberOfWrongAnswers);

            setCurrentQuestionId(questions[0].id);
            setIsFinished(true);
            //setReviewMode(true);
        } catch(err) {
            console.log(err.message);
        } finally {
            setCheckLoading(false)
            closeModal()
        }
        
    }


    // Sorulari al
    const fetchQuestions = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(QUESTIONS_URL);
        
            if (!response.ok) {
                throw new Error("Questions could not retrieved...");
            }

            const questions = await response.json();
            setQuestions(questions);
            setCurrentQuestionId(questions[0].id);
            setLoading(false);

            const initialAnswers = [];
            questions.forEach((question) => {
                initialAnswers.push({'questionId': question.id, 'answerId': null})
               // initialAnswers[question.id] = null;
            });
            setAnswers(initialAnswers);
        } catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);


    if(loading){
        return <Loading />
    }

    if (isFinished) {
        return (
            <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="text-left mb-6">
                        <h4 className="text-2xl font-semibold text-center">Test Finished!</h4>
                        <p className="mt-4 text-center text-gray-700">
                            You have completed the practice session. Your results are shown below:
                        </p>
                    </div>

                    <div className="flex justify-center gap-8 mt-8">
                        <div className="bg-green-200 text-green-800 px-6 py-4 rounded-lg shadow-md w-40">
                            <div className="text-4xl font-bold">{correctAnswers}</div>
                            <div className="mt-2 text-sm font-medium">Correct Answers</div>
                        </div>

                        <div className="bg-red-200 text-red-800 px-6 py-4 rounded-lg shadow-md w-40">
                            <div className="text-4xl font-bold">{incorrectAnswers}</div>
                            <div className="mt-2 text-sm font-medium">Wrong Answers</div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={()=>{setReviewMode(true); setIsFinished(false);}}
                            className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                            Review Answers 
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions.find(question => question.id === currentQuestionId)

    const currentQuestionIndex = answers.findIndex(answer => answer.questionId === currentQuestionId);
    const previousQuestionId = currentQuestionIndex === 0 ? null : answers[currentQuestionIndex - 1].questionId;
    const nextQuestionId = currentQuestionIndex === (answers.length - 1) ? null : answers[currentQuestionIndex + 1].questionId;


    const reviewResult = reviewResults.find(result => result.questionId === currentQuestion.id);

    return(
    <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        
        {/* Header for Question x and Timer */}
        <div className="w-full max-w-2xl flex justify-between mb-2 px-1">
            <div className="text-lg font-medium text-left">
                Question {currentQuestion.id}
            </div>
            <div className="text-2xl font-semibold text-right text-red-600">
                {!reviewMode ? 
                    <Timer duration={1 * 60} onTimeUp={confirmFinishTest} /> : 
                    <>00:00</>
                }
            </div>
        </div>

        
        <div id="questionContainer" className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Question image */}
            {currentQuestion.imagePath && (
                <div className="mb-4 text-center">
                    <img
                        src={currentQuestion.imagePath}
                        alt="Question visual"
                        className="mx-auto max-h-64 object-contain rounded"
                    />
                </div>
            )}

            {/* Question text */}
            <div className="text-2xl font-semibold text-left mb-6">
                <p>{currentQuestion.questionText}</p>
            </div>

            {/* Question options */}
            <div className="space-y-4">
            {
                currentQuestion.answers.map(answer=>{
                    // the base button class
                    let buttonClass = 'w-full py-2 px-4 text-lg text-left rounded-lg';

                    // Apply styles based on conditions
                    if (reviewResult) {
                        if (answer.id === reviewResult.correctAnswerId && reviewResult.selectedAnswerId) {
                            // correct answer
                            buttonClass += ' bg-green-500 text-white';
                        } 
                        else if (answer.id === reviewResult.correctAnswerId && !reviewResult.selectedAnswerId) {
                            // correct answer for unanswered question
                            buttonClass += ' bg-amber-500 text-white';
                        } 
                        else if (answer.id === reviewResult.selectedAnswerId && !reviewResult.correct) {
                            // incorrect answer
                            buttonClass += ' bg-red-500 text-white';
                        } 
                        else {
                            // Default button style for other answers
                            buttonClass += ' bg-gray-200';
                        }
                    } else {
                        if (answers.some(item => item.questionId === currentQuestion.id && item.answerId === answer.id)) {
                            // selected option during test
                            buttonClass += ' bg-blue-500 text-white hover:bg-blue-600';
                        } else {
                            buttonClass += ' bg-gray-200 hover:bg-blue-200';
                        }
                    }

                    

                    return(
                        <button 
                            key={answer.id}
                            onClick={()=>{
                                if(!reviewMode){
                                    setAnswers(prevAnswers => prevAnswers.map(item => 
                                        item.questionId === currentQuestion.id 
                                          ? { ...item, answerId: answer.id }
                                          : item
                                    ));
                                }
                            }} 
                            id={answer.id} 
                            className={buttonClass}
                            >
                            {answer.answerText}
                        </button>
                        )
                })
                
            }
            </div>

        </div>

        <div className="mt-8 w-full max-w-2xl">
            <div className="flex justify-between items-center">
                {/* Previous Button */}
                <button
                    onClick={() => setCurrentQuestionId(previousQuestionId)}
                    disabled={!previousQuestionId}
                    className={`px-4 py-2 text-sm rounded-lg ${
                        !previousQuestionId ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    Previous
                </button>

                {/* Finish Test Button (centered) */}
                {!reviewMode && (
                    <button
                        onClick={() => finishTest()}
                        className="px-4 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                        Finish Test
                    </button>
                )}
                

                {/* Next Button */}
                <button
                    onClick={() => setCurrentQuestionId(nextQuestionId)}
                    disabled={!nextQuestionId}
                    className={`px-4 py-2 text-sm rounded-lg ${
                        !nextQuestionId ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>


        <div className="mt-8 w-full px-4 py-3">
            <nav aria-label="Pagination" className="isolate inline-flex flex-wrap -space-x-px rounded-md shadow-xs">
            <div className="grid grid-cols-11 gap-2">
            {
                answers.map((answer, index) => {
                    
                    // the base button class
                    let buttonClass = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold';
                    
                    if(reviewMode){
                        const reviewResult = reviewResults.find(result => result.questionId === answer.questionId);
                        if (reviewResult.correct) {
                            buttonClass += ' bg-green-300  z-10';
                        }
                        else if (!reviewResult.correct && reviewResult.selectedAnswerId) {
                            buttonClass += ' bg-red-300  z-10';
                        }
                        else if (!reviewResult.correct && !reviewResult.selectedAnswerId) {
                            buttonClass += ' bg-amber-300  z-10';
                        }

                        if(currentQuestionId === answer.questionId){
                            buttonClass += ' ring-2 ring-black';
                        }

                    }
                    else{
                        if(currentQuestionId === answer.questionId){
                            buttonClass += ' bg-indigo-600 text-white z-10';
                        } else {
                            buttonClass += ' text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50';
                        }
                    }
                    
                    
                    return (
                        <button
                            onClick={() => setCurrentQuestionId(answer.questionId)}
                            key={answer.questionId}
                            className={buttonClass}
                        >
                            {index + 1}
                            {!reviewMode && answer.answerId && <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-sm"></span>}
                        </button>
                    )

                })
            }
            </div>
            </nav>
        </div>
        


        {/* Confirmation Modal */}
        <Dialog open={openDialog} onClose={closeModal} className="relative z-10">
            <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                        <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="size-6 text-red-600"
                        />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Are you sure you want to finish the test?
                        </DialogTitle>
                        <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Once you finish, you will not be able to modify your answers. Are you sure you want to continue?
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                    type="button"
                    disabled={checkLoading}
                    onClick={confirmFinishTest}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                    >
                    {checkLoading ? "Checking" : "Finish"}
                    </button>
                    <button
                    type="button"
                    onClick={closeModal}
                    disabled={checkLoading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                    Cancel
                    </button>
                </div>
                </DialogPanel>
            </div>
            </div>
        </Dialog>

    </div>
    )
}
'use client'

import { useEffect, useState } from "react"
import Loading from "@/app/_components/Loading/Loading"
import Link from "next/link"


export default function Practice(){
    const QUESTIONS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/practice'

    const [currentQuestion, setCurrentQuestion] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);

    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    
    const [isFinished, setIsFinished] = useState(false)
    
    // Open the confirmation modal when the Finish Test button is clicked
    const finishTest = () => setIsFinished(true)

    const handleAnswerSelection = (answerId) => {
        if(!selectedAnswerId){
            setSelectedAnswerId(answerId);
        }

        if (answerId === currentQuestion.correctAnswerId) {
            setCorrectAnswers(correctAnswers + 1);
        } else {
            setIncorrectAnswers(incorrectAnswers + 1);
        }
    }

    const fetchQuestion = async () => {
        setSelectedAnswerId(null);
        setLoading(true);
        
        try {
            const response = await fetch(QUESTIONS_URL);
        
            if (!response.ok) {
                throw new Error("Question could not retrieved...");
            }

            const question = await response.json();
            setLoading(false);
            setCurrentQuestion(question);
        } catch(err) {
            console.log(err.message);
        }
    }

    // Get first question
    useEffect(() => {
        fetchQuestion();
    }, []);


    if(loading){
        return <Loading />
    }

    if (isFinished) {
        return (
            <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="text-left mb-6">
                        <h4 className="text-2xl font-semibold text-center">Practice Session Finished!</h4>
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
                        <Link
                            href="/"
                            className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    
    return(
    <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl h-8 bg-gray-200 rounded-lg flex overflow-hidden">
            <div className="w-1/2 h-full bg-green-500 text-white text-center flex items-center justify-center rounded-l-lg">
                {correctAnswers} Correct
            </div>

            <div className="w-1/2 h-full bg-red-500 text-white text-center flex items-center justify-center rounded-r-lg">
                {incorrectAnswers} Wrong
            </div>
        </div>

        
        {/* Header for Question x and Timer */}
        <div className="w-full max-w-2xl flex justify-between mt-6 mb-2 px-1">
            <div className="text-lg font-medium text-left">
                Question {currentQuestion.questionId}
            </div>
            <div className="text-2xl font-semibold text-right text-red-600">
                
            </div>
        </div>

        <div id="questionContainer" className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-2xl font-semibold text-left mb-6">
            <p>{currentQuestion.questionText}</p>
            {
            //Question {currentQuestion.id}:
            }
            </div>

            <div className="space-y-4">
            {
                currentQuestion.answers.map(answer=>{
                    // the base button class
                    let buttonClass = 'w-full py-2 px-4 text-lg text-left rounded-lg';

                    // Apply styles based on conditions
                    if (selectedAnswerId) {
                        if (answer.id === currentQuestion.correctAnswerId) {
                            // correct answer
                            buttonClass += ' bg-green-500 text-white';
                        } 
                        else if (answer.id === selectedAnswerId && selectedAnswerId !== currentQuestion.correctAnswerId) {
                            // incorrect answer
                            buttonClass += ' bg-red-500 text-white';
                        } 
                        else {
                            // Default button style for other answers
                            buttonClass += ' bg-gray-200';
                        }
                    } else {
                        buttonClass += ' bg-gray-200 hover:bg-blue-200';
                    }

                    

                    return(
                        <button 
                            key={answer.id}
                            onClick={()=>handleAnswerSelection(answer.id)} 
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

                {/* Finish Test Button */}
                <button
                    onClick={() => finishTest()}
                    className="px-4 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white"
                >
                    Finish Test
                </button>
                

                {/* Next Button */}
                {selectedAnswerId && (
                    <button
                    onClick={() => fetchQuestion()}
                    className={`px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white`}
                >
                    Next Question
                </button>
                )}
                
            </div>
        </div>


    </div>
    )
}
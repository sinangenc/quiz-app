'use client'

import { useEffect, useState } from "react"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Timer from "../_components/Timer/Timer"
import Loading from "../_components/Loading/Loading"


export default function Practice(){

    const QUESTION_URL = 'http://localhost:8080/practice'

    const [currentQuestion, setCurrentQuestion] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);

    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    
    
    // Open the confirmation modal when the Finish Test button is clicked
    const finishTest = () => setOpenDialog(true)

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

    const fetchQuestion = () => {
        setSelectedAnswerId(null);
        setLoading(true);
        fetch(QUESTION_URL)
            .then(response => response.json())
            .then(question => {  
                setLoading(false);
                setCurrentQuestion(question);
                console.log("Question retrieved...");
            });
    }

    // İlk soruyu al
    useEffect(() => {
        fetchQuestion();
    }, []);


    const totalAnswers = correctAnswers + incorrectAnswers;
    let correctPercentage = 0;
    let incorrectPercentage = 0;

    // Calculate percentage for the progress bar
    if (totalAnswers === 0) {
        correctPercentage = 50;
        incorrectPercentage = 50;
    } else if (correctAnswers === 0) {
        correctPercentage = 0;
        incorrectPercentage = 100;
    } else if (incorrectAnswers === 0) {
        correctPercentage = 100;
        incorrectPercentage = 0;
    } else {
        correctPercentage = (correctAnswers / totalAnswers) * 100;
        incorrectPercentage = 100 - correctPercentage;
    }


    if(loading){
        return <Loading />
    }
    
    return(
    <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl h-8 bg-gray-200 rounded-lg flex">
            {correctPercentage > 0 && (
                <div
                className={`h-full bg-green-500 text-white text-center flex items-center justify-center ${incorrectAnswers === 0 && correctAnswers !== 0 ? 'rounded-lg' : 'rounded-l-lg'}`}
                    style={{
                        width: `${correctPercentage}%`,
                        minWidth: '15%'
                    }}>
                    {correctAnswers} Correct
                </div>
            )}

            {incorrectPercentage > 0 && (
                <div
                className={`h-full bg-red-500 text-white text-center flex items-center justify-center ${correctAnswers === 0 && incorrectAnswers !== 0? 'rounded-lg' : 'rounded-r-lg'}`}
                    style={{
                        width: `${incorrectPercentage}%`,
                        minWidth: '15%'
                    }}>
                    {incorrectAnswers} Wrong
                </div>
            )}
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

        <div className="mt-8 w-full max-w-2xl bg-white">
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
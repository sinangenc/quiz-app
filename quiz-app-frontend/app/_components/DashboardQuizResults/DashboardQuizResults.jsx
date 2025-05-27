'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/_context/AuthContext"
import Loading from "@/app/_components/Loading/Loading"


export default function DashboardQuizResults(){
    const { jwtToken, logout} = useAuth()
    const QUIZ_RESULTS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/quiz-results'
    

    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get data
    const fetchQuizResults = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(QUIZ_RESULTS_URL, {
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

            const quizResults = await response.json();
            setQuizResults(quizResults);
            setLoading(false);
        } catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchQuizResults();
    }, []);

    const createQuizTypeLabel = (quizType) => {
        if(quizType === "TEST"){
            return(
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightsuccess text-success"><span>{quizType}</span></span>
            )
        }else{
            return (
                <span className="flex h-fit w-fit items-center font-medium p-1 text-xs rounded-sm px-2.5 py-1 bg-lightwarning text-warning"><span>{quizType}</span></span>
            )
        }
    }


    if(loading){
        return <Loading />
    }

    return (
        <div className="bg-white p-6 mt-5 rounded-lg shadow text-gray-800 text-lg">
            Last 20 Quiz Results 

            <table className="overflow-hidden w-full text-left text-sm text-gray-500 mt-3">
                <thead className="group/head text-sm font-medium capitalize text-dark border-b border-ld">
                <tr>
                    <th className="text-left px-4 py-4 font-semibold">Completed At</th>
                    <th className="text-left px-4 py-4">Quiz Type</th>
                    <th className="text-left px-4 py-4">Correct Answers</th>
                    <th className="text-left px-4 py-4">Wrong Answers</th>
                </tr>
                </thead>
                <tbody>
                {quizResults.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                        {new Date(result.completedAt)
                            .toLocaleString('de-DE', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                            }
                        ).replace(/\./g, '/').replace(',', '')}
                    </td>
                    <td className="px-4 py-2">{createQuizTypeLabel(result.quizType)}</td>
                    <td className="px-4 py-2">{result.correctAnswersCount}</td>
                    <td className="px-4 py-2">{result.wrongAnswersCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
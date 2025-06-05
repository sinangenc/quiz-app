import { useEffect, useState } from "react"
import { FaUsers, FaQuestionCircle, FaCheckCircle } from "react-icons/fa"
import { useAuth } from "@/app/_context/AuthContext"

export default function DashboardStatistics(){
    const STATISTICS_URL = process.env.NEXT_PUBLIC_API_BASE_URL+'/admin/dashboard/stats'
    const { jwtToken, logout } = useAuth()

    const [stats, setStats] = useState({
        totalUsers: '-',
        totalQuestions: '-',
        totalResults: '-'
    })

    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${STATISTICS_URL}`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                })

                if (res.status === 401) {
                    logout()
                    return
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch statistics.")
                }

                const data = await res.json()
                setStats(data)
            } catch (err) {
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [jwtToken])

    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {/* Total Users */}
            <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 text-4xl">
                    <FaUsers />
                </div>
                <div>
                    <div className="text-sm text-gray-500">Total Users</div>
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    ) : (
                        <div className="text-2xl font-bold text-gray-800">
                            {stats.totalUsers}
                        </div>
                    )}
                </div>
            </div>

            {/* Total Questions */}
            <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 text-4xl">
                    <FaQuestionCircle />
                </div>
                <div>
                    <div className="text-sm text-gray-500">Total Questions</div>
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    ) : (
                        <div className="text-2xl font-bold text-gray-800">
                            {stats.totalQuestions}
                        </div>
                    )}
                </div>
            </div>

            {/* Solved Tests */}
            <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                <div className="bg-green-100 text-green-600 rounded-full p-3 text-4xl">
                    <FaCheckCircle />
                </div>
                <div>
                    <div className="text-sm text-gray-500">Completed Tests</div>
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    ) : (
                        <div className="text-2xl font-bold text-gray-800">
                            {stats.totalResults}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
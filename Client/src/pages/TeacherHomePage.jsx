import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileUp, AlertCircle } from 'lucide-react'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { toast } from 'react-toastify'

export default function TeacherHomePage() {
    const [totalQueries, setTotalQueries] = useState(0)
    const [pendingQueries, setPendingQueries] = useState(0)
    const [recentActivities, setRecentActivities] = useState([])
    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        fetchQueries()
    }, [])

    const fetchQueries = async () => {
        try {
            const response = await axios.post('/query/all', { access_token: auth.access_token })
            const queries = response.data.queries

            setTotalQueries(queries.length)
            setPendingQueries(queries.filter(query => !query.status).length)

            const sortedQueries = [...queries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            const recentQueries = sortedQueries.slice(0, 3)

            const activitiesPromises = recentQueries.map(async (query) => {
                try {
                    const userResponse = await axios.get(`/auth/details/${query.from}`)
                    const userData = userResponse.data
                    if (query.status) {
                        return `Responded to query from ${userData.name}`
                    } else {
                        return `New query received from ${userData.name}`
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error)
                    return `Query ${query.status ? 'responded' : 'received'}`
                }
            })

            const activities = await Promise.all(activitiesPromises)
            setRecentActivities(activities)
        } catch (error) {
            console.error('Error fetching queries:', error)
            toast.error('Failed to fetch queries')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[#fe965e]">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingQueries}</div>
                        <p className="text-xs text-muted-foreground">
                            Queries awaiting response
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalQueries}</div>
                        <p className="text-xs text-muted-foreground">
                            Total queries received
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upload Files</CardTitle>
                        <FileUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Link to="/learn">
                            <Button
                                className="w-full bg-[#fe965e] hover:bg-[#e8854e] text-white"
                            >
                                Upload Files
                            </Button>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-2">
                            Upload new learning materials
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions and uploads</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {recentActivities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
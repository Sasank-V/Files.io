import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileUp, AlertCircle } from 'lucide-react'

export default function TeacherHomePage() {
    const [totalQueries, setTotalQueries] = useState(15)
    const [pendingQueries, setPendingQueries] = useState(5)
    const navigate = useNavigate()

    const handleUploadClick = () => {
        navigate('/upload')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-[#fe965e]">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        <CardTitle className="text-sm font-medium">Upload Files</CardTitle>
                        <FileUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleUploadClick}
                            className="w-full bg-[#fe965e] hover:bg-[#e8854e] text-white"
                        >
                            Upload Files
                        </Button>
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
                        <li>Responded to 3 queries in Mathematics</li>
                        <li>Uploaded new assignment for Physics</li>
                        <li>Updated syllabus for Chemistry</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
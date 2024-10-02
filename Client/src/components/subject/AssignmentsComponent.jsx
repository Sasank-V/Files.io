import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'

const assignments = [
    { id: 1, title: 'Assignment 1: Fundamentals', dueDate: '2024-03-15' },
    { id: 2, title: 'Assignment 2: Advanced Concepts', dueDate: '2024-04-01' },
    { id: 3, title: 'Assignment 3: Practical Application', dueDate: '2024-04-15' },
    { id: 4, title: 'Final Project', dueDate: '2024-05-01' },
]

const AssignmentsComponent = ({ subjectId }) => {
    const handleDownload = (assignmentId) => {
        // This is a placeholder function for the download logic
        // In a real application, you would implement the actual download functionality here
        console.log(`Downloading assignment ${assignmentId} for ${subjectId}`)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#fe965e]">Assignments</CardTitle>
                    <CardDescription>Download assignments related to {subjectId}</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{assignment.title}</CardTitle>
                            <CardDescription className="flex items-center mt-2">
                                <Calendar className="mr-2 h-4 w-4" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => handleDownload(assignment.id)}
                                className="w-full bg-[#fe965e] hover:bg-[#e8854e] text-white"
                            >
                                <Download className="mr-2 h-4 w-4" /> Download Assignment
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default AssignmentsComponent
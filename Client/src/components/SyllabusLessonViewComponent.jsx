import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SyllabusLessonViewComponent = ({ subject, current, isSyllabus = true }) => {
    const page = isSyllabus ? "Syllabus" : "Lesson Plan";

    return (
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-xl">
            <CardHeader className="border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-[#fe965e]">Current {isSyllabus ? "Syllabus" : "Lesson Plan"}</CardTitle>
                        <CardDescription className="mt-1 text-gray-400">View or download the current {page} for {subject.name}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center pt-6">
                <div className="flex items-center">
                    <FileText className="h-6 w-6 text-[#fe965e] mr-2" />
                    <span className="text-lg text-gray-300">{current.filename || `No ${page} uploaded`}</span>
                </div>
                <Button
                    disabled={!current.url}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-4 py-2 text-sm transition-colors duration-200"
                >
                    <Download className="mr-2 h-4 w-4" />
                    <a href={current.url} className="hover:text-[#fe965e] transition-colors duration-200">Download</a>
                </Button>
            </CardContent>
        </Card>
    )
}

export default SyllabusLessonViewComponent
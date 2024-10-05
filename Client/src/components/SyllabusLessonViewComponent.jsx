import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SyllabusLessonViewComponent = ({ subject, current, isSyllabus = true }) => {
    const page = isSyllabus ? "Syllabus" : "Lesson Plan";

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-[#fe965e]">Current {isSyllabus ? "Syllabus" : "Lesson Plan"}</CardTitle>
                        <CardDescription className="mt-1">View or download the current {page} for {subject.name}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                <div className="flex items-center">
                    <FileText className="h-6 w-6 text-[#fe965e] mr-2" />
                    <span className="text-lg">{current.filename || `No ${page} uploaded`}</span>
                </div>
                <Button
                    disabled={!current.url}
                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-4 py-2 text-sm"
                >
                    <Download className="mr-2 h-4 w-4" /><a href={current.url}>Download</a>
                </Button>
            </CardContent>
        </Card>
    )
}
export default SyllabusLessonViewComponent
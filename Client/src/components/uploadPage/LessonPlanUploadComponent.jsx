import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Upload, FileText } from 'lucide-react'

const LessonPlanUploadComponent = ({ subject }) => {
    const [file, setFile] = useState(null)
    const currentLessonPlan = null;

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = () => {
        if (file) {
            console.log(`Uploading ${file.name} for ${subject}`)
            // Implement actual upload logic here
        } else {
            console.log('No file selected')
        }
    }

    const handleDownload = () => {
        console.log(`Downloading ${subject} syllabus PDF`)
        // Implement actual download logic here
    }

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto">
            {/* Current Syllabus Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Current Lesson Plan</CardTitle>
                            <CardDescription className="mt-1">View or download the current lesson plan for {subject}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                    <div className="flex items-center">
                        <FileText className="h-6 w-6 text-[#fe965e] mr-2" />
                        <span className="text-lg">{currentLessonPlan || 'No lesson plan uploaded'}</span>
                    </div>
                    <Button
                        onClick={handleDownload}
                        disabled={!currentLessonPlan}
                        className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-4 py-2 text-sm"
                    >
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardContent>
            </Card>

            {/* Upload Syllabus Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Upload New Lesson Plan</CardTitle>
                            <CardDescription className="mt-1">Upload a new Lesson Plan PDF for {subject}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="syllabus-file" className="text-sm font-medium text-gray-700">
                            Select Lesson Plan PDF
                        </Label>
                        <Input
                            id="syllabus-file"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file:mr-4 h-max py-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fe965e] file:text-white hover:file:bg-[#e8854e]"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleUpload}
                            disabled={!file}
                            className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Upload className="mr-2 h-5 w-5" /> Upload Lesson Plan PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LessonPlanUploadComponent
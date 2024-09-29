import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Upload, FileText } from 'lucide-react'
import { storage } from '@/../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const SyllabusUploadComponent = ({ subject, currentSyllabus }) => {
    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const fs = Array.from(e.target.files);
            setFile(fs)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        const f = file[0];
        const storageRef = ref(storage, `images/${f.name}`);

        try {
            const snapshot = await uploadBytes(storageRef, f);

            const downloadedUrl = await getDownloadURL(snapshot.ref);

            console.log(downloadedUrl);

        } catch (error) {
            console.error(error)
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
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Current Syllabus</CardTitle>
                            <CardDescription className="mt-1">View or download the current syllabus for {subject}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                    <div className="flex items-center">
                        <FileText className="h-6 w-6 text-[#fe965e] mr-2" />
                        <span className="text-lg">{currentSyllabus || 'No syllabus uploaded'}</span>
                    </div>
                    <Button
                        onClick={handleDownload}
                        disabled={!currentSyllabus}
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
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Upload New Syllabus</CardTitle>
                            <CardDescription className="mt-1">Upload a new syllabus PDF for {subject}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="syllabus-file" className="text-sm font-medium text-gray-700">
                            Select Syllabus PDF
                        </Label>
                        <Input
                            id="syllabus-file"
                            type="file"
                            accept=".pdf"
                            multiple
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
                            <Upload className="mr-2 h-5 w-5" /> Upload Syllabus PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SyllabusUploadComponent
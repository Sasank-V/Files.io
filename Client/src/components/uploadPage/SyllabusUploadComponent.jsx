import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import axios from '@/api/axios'
import uploadFile from '@/firebase/firebaseUtils'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import SyllabusLessonViewComponent from '@/components/SyllabusLessonViewComponent'

const SyllabusUploadComponent = ({ subjectId }) => {
    const [file, setFile] = useState(null)
    const [subject, setSubject] = useState({});
    const [currentSyllabus, setCurrentSyllabus] = useState({ filename: "", url: "" });
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        const fetchSyllabusDetails = async () => {
            const res = await axios.get(`/learn/syll/${subjectId}`);
            const syllabus = res.data.data;

            setCurrentSyllabus((prev) => ({ ...prev, filename: syllabus?.name, url: syllabus?.url }));

            console.log(res);
        }

        fetchSubjectDetails();
        fetchSyllabusDetails();
    }, []);


    const handleFileChange = (e) => {
        if (e.target.files) {
            const fs = Array.from(e.target.files);
            setFile(fs)
        }
    }

    const handleUpload = async () => {
        const fileName = subject.name + "_Syllabus.pdf";
        const url = await uploadFile(file, subjectId, "syllabus", fileName);

        const response = await axiosPrivate.post(`/admin/upload/syll/${subjectId}`, { url: url, access_token: auth.access_token });

        setCurrentSyllabus((prev) => ({ ...prev, filename: fileName, url }));

        console.log(response.data);
    }

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto">
            {/* Current Syllabus Card */}
            <SyllabusLessonViewComponent subject={subject} current={currentSyllabus} />

            {/* Upload Syllabus Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Upload New Syllabus</CardTitle>
                            <CardDescription className="mt-1">Upload a new syllabus PDF for {subject.name}</CardDescription>
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
                            accept=".pdf,.pptx"
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
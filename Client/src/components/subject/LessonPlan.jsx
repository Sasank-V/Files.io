import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from '@/api/axios'

const LessonPlan = ({ subjectId }) => {
    const [subject, setSubject] = useState({});

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        fetchSubjectDetails();
    }, [])

    const handleDownload = () => {
        console.log(`Downloading ${subject.name} lesson plan PDF`)
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-[#fe965e]">Lesson Plan</CardTitle>
                        <CardDescription className="mt-1">Download the weekly lesson plan for {subject.name}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Button
                    onClick={handleDownload}
                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-6 py-3 text-lg"
                >
                    <Download className="mr-2 h-5 w-5" /> Download Lesson Plan PDF
                </Button>
            </CardContent>
        </Card>
    )
}

export default LessonPlan
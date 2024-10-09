import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Trash2 } from 'lucide-react'
import axios from '@/api/axios'
import uploadFile from '@/firebase/firebaseUtils'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import SyllabusLessonViewComponent from '@/components/SyllabusLessonViewComponent'
import LoadingComponent from '../loading'
import { toast } from 'react-toastify'

const LessonPlanUploadComponent = ({ subjectId }) => {
    const [file, setFile] = useState(null)
    const [subject, setSubject] = useState({});
    const [currentLessonPlan, setCurrentLessonPlan] = useState({ filename: "", url: "" });
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [doneUpload, setDoneUpload] = useState(true);
    const [subjectAdmin, setSubjectAdmin] = useState("");

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;
            setSubject(data.data);
        }

        const fetchLessonPlanDetails = async () => {
            const res = await axios.get(`/learn/lp/${subjectId}`);
            const lessonPlan = res.data.data;
            setCurrentLessonPlan((prev) => ({ ...prev, filename: lessonPlan?.name, url: lessonPlan?.url }));
        }

        fetchSubjectDetails();
        fetchLessonPlanDetails();
    }, []);

    useEffect(() => {
        const fetchSubjectAdminDetails = async () => {
            const res = await axiosPrivate.get(`/auth/details/${subject.admin}`);
            const data = res.data;
            setSubjectAdmin(data.name);
        }

        fetchSubjectAdminDetails();
    }, [subject])

    const handleFileChange = (e) => {
        if (e.target.files) {
            const fs = Array.from(e.target.files);
            setFile(fs)
        }
    }

    const handleUpload = async () => {
        if (subjectAdmin !== auth.username) {
            toast.error("Unauthorised Request", { position: 'top-right' });
            return;
        }

        const fileName = subject.name + "_LessonPlan.pdf";
        setDoneUpload(false);
        const url = await uploadFile(file, subjectId, "lessonPlan", fileName);

        const response = await axiosPrivate.post(`/admin/upload/lp/${subjectId}`, { url: url, access_token: auth.access_token });

        setCurrentLessonPlan((prev) => ({ ...prev, filename: fileName, url }));
        setDoneUpload(true);
        toast.success("Lesson Plan uploaded successfully", { position: 'top-right' });
    }

    const handleDelete = async () => {
        if (subjectAdmin !== auth.username) {
            toast.error("Unauthorised Request", { position: 'top-right' });
            return;
        }

        try {
            setDoneUpload(false);
            const response = await axios.delete(`/admin/delete/lp/${subjectId}`, { data: { access_token: auth.access_token } });

            setCurrentLessonPlan({ filename: "", url: "" });
            setDoneUpload(true);
            toast.success("Lesson Plan deleted successfully", { position: 'top-right' });
        } catch (error) {
            console.error("Error deleting lesson plan:", error);
            toast.error("Failed to delete lesson plan", { position: 'top-right' });
        } finally {
            setDoneUpload(true);
        }
    }

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto">
            <SyllabusLessonViewComponent subject={subject} current={currentLessonPlan} isSyllabus={false} />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Manage Lesson Plan</CardTitle>
                            <CardDescription className="mt-1">Upload or delete Lesson Plan PDF for {subject.name}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!doneUpload ? <LoadingComponent text="Processing" /> : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="lessonplan-file" className="text-sm font-medium text-gray-700">
                                    Select Lesson Plan PDF
                                </Label>
                                <Input
                                    id="lessonplan-file"
                                    type="file"
                                    accept=".pdf,.pptx"
                                    multiple
                                    onChange={handleFileChange}
                                    className="file:mr-4 h-max py-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fe965e] file:text-white hover:file:bg-[#e8854e]"
                                />
                            </div>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={handleUpload}
                                    disabled={!file}
                                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Upload className="mr-2 h-5 w-5" /> Upload Lesson Plan
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={!currentLessonPlan.url}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="mr-2 h-5 w-5" /> Delete Lesson Plan
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default LessonPlanUploadComponent
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

const SyllabusUploadComponent = ({ subjectId }) => {
    const [file, setFile] = useState(null)
    const [subject, setSubject] = useState({});
    const [currentSyllabus, setCurrentSyllabus] = useState({ filename: "", url: "" });
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

        const fetchSyllabusDetails = async () => {
            const res = await axios.get(`/learn/syll/${subjectId}`);
            const syllabus = res.data.data;
            setCurrentSyllabus((prev) => ({ ...prev, filename: syllabus?.name, url: syllabus?.url }));
        }

        fetchSubjectDetails();
        fetchSyllabusDetails();
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

        const fileName = subject.name + "_Syllabus.pdf";
        setDoneUpload(false);
        const url = await uploadFile(file, subjectId, "syllabus", fileName);

        const response = await axiosPrivate.post(`/admin/upload/syll/${subjectId}`, { url: url, access_token: auth.access_token });

        setCurrentSyllabus((prev) => ({ ...prev, filename: fileName, url }));
        setDoneUpload(true);

        console.log(response.data);
    }

    const handleDelete = async () => {
        if (subjectAdmin !== auth.username) {
            toast.error("Unauthorised Request", { position: 'top-right' });
            return;
        }

        try {
            setDoneUpload(false);
            const response = await axiosPrivate.delete(`/admin/delete/syll/${subjectId}`, {
                data: { access_token: auth.access_token }
            });
            setCurrentSyllabus({ filename: "", url: "" });
            setDoneUpload(true);
            toast.success("Syllabus deleted successfully", { position: 'top-right' });
        } catch (error) {
            console.error("Error deleting syllabus:", error);
            toast.error("Failed to delete syllabus", { position: 'top-right' });
        } finally {
            setDoneUpload(true);
        }
    }

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto">
            <SyllabusLessonViewComponent subject={subject} current={currentSyllabus} />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-[#fe965e]">Manage Syllabus</CardTitle>
                            <CardDescription className="mt-1">Upload or delete syllabus PDF for {subject.name}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!doneUpload ? <LoadingComponent text="Processing" /> : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="syllabus-file" className="text-sm font-medium text-gray-700">
                                    Select Syllabus PDF
                                </Label>
                                <Input
                                    id="syllabus-file"
                                    type="file"
                                    accept=".pdf,.pptx"
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
                                    <Upload className="mr-2 h-5 w-5" /> Upload Syllabus
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={!currentSyllabus.url}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="mr-2 h-5 w-5" /> Delete Syllabus
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default SyllabusUploadComponent
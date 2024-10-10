import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'
import axios, { axiosPrivate } from '@/api/axios'
import TheoryDisplayComponent from '../TheoryDisplayComponent'
import useAuth from '@/hooks/useAuth'
import uploadFile from '@/firebase/firebaseUtils'
import { toast } from 'react-toastify'
import LoadingComponent from '../loading'

export default function LabsUploadComponent({ subjectId }) {
    const [selectedModule, setSelectedModule] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [modules, setModules] = useState([])
    const [materialName, setMaterialName] = useState('')
    const { auth } = useAuth();
    const [doneUpload, setDoneUpload] = useState(true);


    const fetchModules = async () => {
        try {
            const res = await axios.get(`/learn/module/all/${subjectId}/1`)
            let data = res.data.data
            setModules(data)
        } catch (error) {
            console.error('Error fetching modules:', error)
        }
    }

    useEffect(() => {
        fetchModules()
    }, [subjectId]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(Array.from(e.target.files))
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()

        if (!selectedModule || !materialName) {
            toast('Please fill in all fields and select at least one file.', { position: 'top-right' })
            return
        }
        setDoneUpload(false);

        const fileUrl = await uploadFile(selectedFile, subjectId, `components/1/${selectedModule}`, materialName);
        if (!fileUrl) {
            toast.error("File not uploaded", { position: 'top-right' });
            return;
        }

        try {
            const response = await axiosPrivate.post(`/admin/upload/module/${subjectId}/${selectedModule}`, { access_token: auth.access_token, files: [{ name: materialName, url: fileUrl }] });

            setDoneUpload(true);

            setSelectedModule('')
            setSelectedFile(null)

            fetchModules();
        } catch (error) {
            toast.error("Error uploading material", { position: 'top-right' });
            const baseUrl = ""
            const path = decodeURIComponent(fileUrl.split(baseUrl)[1].split("?")[0]);

            // console.error('Error uploading material:', error)
        } finally {
            setDoneUpload(true);
        }
    }

    return (
        <div className="space-y-6">
            <TheoryDisplayComponent modules={modules} setModules={setModules} subjectId={subjectId} isTheory={false} />

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-[#fe965e]">Add Materials</CardTitle>
                    <CardDescription>Upload new materials for a specific experiment</CardDescription>
                </CardHeader>
                <CardContent>
                    {!doneUpload ? <LoadingComponent text="Uploading" /> :
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="unit-select">Select Experiment</Label>
                                <Select onValueChange={setSelectedModule} value={selectedModule}>
                                    <SelectTrigger id="unit-select">
                                        <SelectValue placeholder="Select an experiment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules.map((module) => (
                                            <SelectItem key={module.id} value={module.id}>
                                                {`Experiment - ${module.unitNo} : ${module.title}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="module-name">Material Name</Label>
                                <Input
                                    id="module-name"
                                    value={materialName}
                                    onChange={(e) => setMaterialName(e.target.value)}
                                    placeholder="Enter material name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Upload Files (PDF or PPTX)</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.pptx"
                                    className="file:mr-4 h-max p-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fe965e] file:text-white hover:file:bg-[#e8854e]"
                                />
                            </div>
                            <Button type="submit" className="bg-[#fe965e] hover:bg-[#e8854e] text-white">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Materials
                            </Button>
                        </form>}
                </CardContent>
            </Card>
        </div>
    )
}
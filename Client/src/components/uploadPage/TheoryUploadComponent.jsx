import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'
import axios from '@/api/axios'
import TheoryDisplayComponent from '../TheoryDisplayComponent'
import useAuth from '@/hooks/useAuth'
import uploadFile from '@/firebase/firebaseUtils'
import { toast } from 'react-toastify'

export default function TheoryUploadComponent({ subjectId }) {
    const [selectedModule, setSelectedModule] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [modules, setModules] = useState([])
    const [materialName, setMaterialName] = useState('')
    const { auth } = useAuth();


    const fetchModules = async () => {
        try {
            const res = await axios.get(`/learn/module/all/${subjectId}/0`)
            let data = res.data.data
            console.log(data)
            setModules(data)
        } catch (error) {
            console.error('Error fetching modules:', error)
        }
    }

    useEffect(() => {
        fetchModules()
    }, [subjectId])

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(Array.from(e.target.files))
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()

        if (!selectedModule || !materialName) {
            alert('Please fill in all fields and select at least one file.')
            return
        }

        const fileUrl = await uploadFile(selectedFile, subjectId, `components/0/${selectedModule}`, materialName);
        if (!fileUrl) {
            toast.error("File not uploaded", { position: 'top-right' });
            return;
        }

        try {
            const response = await axios.post(`/admin/upload/module/${subjectId}/${selectedModule}`, { access_token: auth.access_token, files: [{ name: materialName, url: fileUrl }] });

            setSelectedModule('')
            setSelectedFile(null)

            fetchModules();
        } catch (error) {
            console.error('Error uploading materiak:', error)
        }
    }

    return (
        <div className="space-y-6">
            <TheoryDisplayComponent modules={modules} />

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-[#fe965e]">Add Materials</CardTitle>
                    <CardDescription>Upload new materials for a specific unit</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="unit-select">Select Unit</Label>
                            <Select onValueChange={setSelectedModule} value={selectedModule}>
                                <SelectTrigger id="unit-select">
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((module) => (
                                        <SelectItem key={module.id} value={module.id}>
                                            {`Module - ${module.unitNo} : ${module.title}`}
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
                                placeholder="Enter module name"
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
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
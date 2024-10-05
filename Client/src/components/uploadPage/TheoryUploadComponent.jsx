import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Video, Presentation, Upload } from 'lucide-react'
import axios from '@/api/axios'

const TheoryUploadComponent = ({ subjectId }) => {
    const units = [
        'Module 1',
        'Module 2',
        'Module 3',
        'Module 4',
        'Module 5',
        'Module 6',
        'Module 7',
        'Module 8',
    ]

    const [activeModule, setActiveModule] = useState(null)
    const [selectedUnit, setSelectedUnit] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])
    const [modules, setModules] = useState([])
    const [currentMaterials, setCurrentMaterials] = useState([])

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await axios.get(`/learn/module/all/${subjectId}/0`)
                let data = res.data.data

                console.log(data);
                setModules(data)
            } catch (error) {
                console.error('Error fetching modules:', error)
            }
        }

        fetchModules()
    }, [subjectId])

    const handleDownload = (unit, material) => {
        console.log(`Downloading ${material} for ${unit} of ${subjectId}`)
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files))
    }

    const handleModuleChange = async (module) => {
        setActiveModule(module)

        const moduleId = module.id

        try {
            const res = await axios.get(`learn/module/get/${moduleId}`)
            const data = res.data.data.mats;
            setCurrentMaterials(data)
            console.log(data)
        } catch (error) {
            console.error('Error fetching module materials:', error)
        }
    }

    const handleUpload = (e) => {
        e.preventDefault()
        if (selectedUnit && selectedFiles.length > 0) {
            console.log(`Uploading ${selectedFiles.length} file(s) to ${selectedUnit} for ${subjectId}`)
            // Implement actual upload logic here
        } else {
            console.log('Please select a unit and at least one file')
        }
    }

    const getIcon = (materialType) => {
        switch (materialType) {
            case 'pdf':
                return <FileText className="h-4 w-4 text-[#fe965e]" />
            case 'pptx':
                return <Presentation className="h-4 w-4 text-[#fe965e]" />
            case 'mp4':
                return <Video className="h-4 w-4 text-[#fe965e]" />
            default:
                return <FileText className="h-4 w-4 text-[#fe965e]" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modules.map((module) => (
                    <Card
                        key={module.id}
                        className={`cursor-pointer transition-all duration-200 ${activeModule === module ? 'ring-2 ring-[#fe965e]' : 'hover:shadow-md'
                            }`}
                        onClick={() => handleModuleChange(module)}
                    >
                        <CardHeader>
                            <CardTitle className="text-md font-bold">Module - {module.unitNo}</CardTitle>
                            <CardTitle className="text-sm">{module.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            {activeModule && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#fe965e]">{activeModule.title}</CardTitle>
                        <CardTitle className="text-md text-[#fe965e]">{activeModule.title}</CardTitle>
                        <CardDescription>Download materials for this unit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Name</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentMaterials.map((material) => (
                                        <TableRow key={material.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    {getIcon("5")}
                                                    <span className="ml-2">{material.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(activeModule.title, material.name)}
                                                    className="hover:text-[#fe965e] hover:bg-[#fe965e]/10"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    <a href={material.url}>Download</a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-[#fe965e]">Add Materials</CardTitle>
                    <CardDescription>Upload new materials for a specific unit</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="unit-select">Select Unit</Label>
                            <Select onValueChange={setSelectedUnit} value={selectedUnit}>
                                <SelectTrigger id="unit-select">
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((module) => (
                                        <SelectItem key={module.id} value={`Module - ${module.unitNo}`}>
                                            {`Module - ${module.unitNo} : ${module.title}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Upload Files (PDF or PPTX)</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.pptx"
                                multiple
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

export default TheoryUploadComponent
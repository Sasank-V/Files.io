import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Plus, Video, Presentation, Upload, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from '@/api/axios'
import { toast } from 'react-toastify'
import useAuth from '@/hooks/useAuth'
import uploadFile from '@/firebase/firebaseUtils'
import LoadingComponent from '../loading'
import NoComponentsCard from '../NoComponentsCard'

export default function AssignmentsComponent({ subjectId }) {
    const { auth } = useAuth();
    const [assignments, setAssignments] = useState([])
    const [currentAssignment, setCurrentAssignment] = useState(null)
    const [currentMaterials, setCurrentMaterials] = useState([])
    const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false)
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        unitNo: '',
        description: ''
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [materialName, setMaterialName] = useState('')
    const [selectedAssignment, setSelectedAssignment] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get(`/learn/module/all/${subjectId}/2`)
                let data = res.data.data;
                data = data.sort((a, b) => a.unitNo - b.unitNo);
                setAssignments(data)
            } catch (error) {
                console.error('Error fetching assignments:', error)
                toast.error("Failed to fetch assignments", { position: 'top-right' })
            }
        }

        fetchAssignments()
    }, [subjectId])

    const handleAssignmentChange = async (assignment) => {
        setCurrentAssignment(assignment);
        const assId = assignment.id;
        try {
            const res = await axios.get(`learn/module/get/${assId}`)
            const data = res.data.data.mats
            setCurrentMaterials(data)
        } catch (error) {
            console.error('Error fetching module materials:', error)
        }
    }

    const handleAddAssignment = () => {
        setIsAddAssignmentOpen(true)
    }

    const handleCloseAddAssignment = () => {
        setIsAddAssignmentOpen(false)
        setNewAssignment({ title: '', unitNo: '', description: '' })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewAssignment(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newAssignment.description || !newAssignment.title || !newAssignment.unitNo) {
            toast.error("Some fields are empty", { position: 'top-right' });
            return;
        }

        try {
            const res = await axios.post(`/admin/upload/comp/${subjectId}`, {
                access_token: auth.access_token,
                family: "2",
                unitNo: newAssignment.unitNo,
                title: newAssignment.title,
                desc: newAssignment.description,
            });
            const data = res.data.data;

            setAssignments((prev) => ([...prev, {
                id: data._id,
                title: data.title,
                unitNo: data.no,
                desc: data.desc
            }]));
            handleCloseAddAssignment()
            toast.success("Assignment added successfully", { position: 'top-right' });
        } catch (error) {
            console.error('Error adding assignment:', error)
            toast.error("Failed to add assignment", { position: 'top-right' });
        }
    }

    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm("Are you sure you want to delete this assignment? This action cannot be undone.")) {
            try {
                await axios.delete(`/admin/delete/module/${subjectId}/${assignmentId}`, {
                    data: { access_token: auth.access_token }
                });
                setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
                if (currentAssignment && currentAssignment.id === assignmentId) {
                    setCurrentAssignment(null);
                    setCurrentMaterials([]);
                }
                toast.success("Assignment deleted successfully", { position: 'top-right' });
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error("Failed to delete assignment", { position: 'top-right' });
            }
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

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(Array.from(e.target.files))
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()

        if (!selectedAssignment || !materialName || !selectedFile) {
            toast.error('Please fill in all fields and select a file.', { position: 'top-right' })
            return
        }
        setIsUploading(true)

        try {
            const fileUrl = await uploadFile(selectedFile, subjectId, `components/2/${selectedAssignment}`, materialName)
            if (!fileUrl) {
                toast.error("File not uploaded", { position: 'top-right' })
                return
            }

            const response = await axios.post(`/admin/upload/module/${subjectId}/${selectedAssignment}`, {
                access_token: auth.access_token,
                files: [{ name: materialName, url: fileUrl }]
            })

            toast.success("Material uploaded successfully", { position: 'top-right' })

            setSelectedAssignment('')
            setSelectedFile(null)
            setMaterialName('')

            // Refresh the materials if the current assignment is the one we just uploaded to
            if (currentAssignment && currentAssignment.id === selectedAssignment) {
                handleAssignmentChange(currentAssignment)
            }
        } catch (error) {
            toast.error("Error uploading material", { position: 'top-right' })
            console.error('Error uploading material:', error)
        } finally {
            setIsUploading(false)
        }
    }

    if (assignments.length === 0 && !auth.isAdmin) {
        return (
            <NoComponentsCard text="Assignments" />
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assignments.map((assignment, index) => (
                    <Card
                        key={assignment.id}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${currentAssignment === assignment
                            ? 'ring-2 ring-[#fe965e]'
                            : 'hover:shadow-lg hover:scale-105'
                            }`}
                        onClick={() => handleAssignmentChange(assignment)}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${index % 2 === 0 ? '#2A2A2A' : '#3A3A3A'} 0%, 
                                ${index % 2 === 0 ? '#3A3A3A' : '#2A2A2A'} 100%)`
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-md font-bold text-white">Assignment - {assignment.unitNo}</CardTitle>
                            <CardTitle className="text-sm text-gray-300">{assignment.title}</CardTitle>
                        </CardHeader>
                        {auth.isAdmin && (
                            <CardContent>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAssignment(assignment.id);
                                    }}
                                    variant="destructive"
                                    size="sm"
                                    className="mt-2"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </CardContent>
                        )}
                    </Card>
                ))}
                <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                    {auth.isAdmin &&
                        <DialogTrigger asChild>
                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-md flex items-center justify-center"
                                onClick={handleAddAssignment}
                            >
                                <CardHeader>
                                    <CardTitle className="text-md font-bold flex items-center">
                                        <Plus className="h-6 w-6 mr-2 text-[#fe965e]" />
                                        Add Assignment
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </DialogTrigger>
                    }
                    <DialogContent className="sm:max-w-[425px] border-0 bg-white dark:bg-gray-800 text-white font-vssemibold" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)' }}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#fe965e]">Add New Assignment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-white dark:text-gray-300">Assignment Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={newAssignment.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitNo" className="text-sm font-medium text-white dark:text-gray-300">Assignment Number</Label>
                                <Input
                                    id="unitNo"
                                    name="unitNo"
                                    type="number"
                                    value={newAssignment.unitNo}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-white dark:text-gray-300">Assignment Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={newAssignment.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseAddAssignment}
                                    className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#fe965e] rounded-md hover:bg-[#e8854e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e]"
                                >
                                    Add Assignment
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {currentAssignment && (
                <Card className="mt-4 overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
                }}>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl text-[#fe965e]">{currentAssignment.title}</CardTitle>
                        <CardDescription>Assignment materials</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="w-full overflow-auto bg-gray-800 bg-opacity-70 rounded-lg shadow-inner">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px] text-gray-300">Name</TableHead>

                                        <TableHead className="text-right text-gray-300">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentMaterials.map((material) => (
                                        <TableRow key={material.id} className="border-b border-gray-700">
                                            <TableCell className="font-medium text-gray-200">
                                                <div className="flex items-center">
                                                    {getIcon(material.type)}
                                                    <span className="ml-2">{material.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <a href={material.url}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-300 hover:text-[#fe965e] hover:bg-[#fe965e]/10"
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
            {auth.isAdmin && (
                <Card className="mt-4 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#fe965e]">Add Materials</CardTitle>
                        <CardDescription>Upload new materials for a specific assignment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isUploading
                            ? <LoadingComponent text="Uploading" />
                            : <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assignment-select">Select Assignment</Label>
                                    <Select onValueChange={setSelectedAssignment} value={selectedAssignment}>
                                        <SelectTrigger id="assignment-select">
                                            <SelectValue placeholder="Select an assignment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assignments.map((assignment) => (
                                                <SelectItem key={assignment.id} value={assignment.id}>
                                                    {`Assignment - ${assignment.unitNo} : ${assignment.title}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="material-name">Material Name</Label>
                                    <Input
                                        id="material-name"
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
                                <Button type="submit" className="bg-[#fe965e] hover:bg-[#e8854e] text-white" disabled={isUploading}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Materials
                                </Button>
                            </form>}
                    </CardContent>
                </Card>
            )}
        </>
    )
}
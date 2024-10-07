import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useEffect, useState } from 'react'
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
import { Download, FileText, Video, Presentation, Plus, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from '@/api/axios'
import { toast } from 'react-toastify'
import useAuth from '@/hooks/useAuth'

export default function TheoryDisplayComponent({ modules, setModules, subjectId, isTheory = true }) {
    const { auth } = useAuth();
    const [currentMaterials, setCurrentMaterials] = useState([])
    const [activeModule, setActiveModule] = useState(null)
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
    const [newModule, setNewModule] = useState({
        title: '',
        unitNo: '',
        description: ''
    })

    useEffect(() => {
        const func = async () => {
            try {
                const res = await axios.get(`learn/module/get/${activeModule.id}`)
                const data = res.data.data.mats;
                setCurrentMaterials(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching module materials:', error)
            }
        }

        func();
    }, [modules])

    const handleModuleChange = async (module) => {
        setActiveModule(module)

        const moduleId = module.id

        try {
            const res = await axios.get(`learn/module/get/${moduleId}`)
            const data = res.data.data.mats
            setCurrentMaterials(data)
            console.log(data)
        } catch (error) {
            console.error('Error fetching module materials:', error)
        }
    }

    const handleAddModule = () => {
        setIsAddModuleOpen(true)
    }

    const handleCloseAddModule = () => {
        setIsAddModuleOpen(false)
        setNewModule({ title: '', unitNo: '', description: '' })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewModule(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newModule.description || !newModule.title || !newModule.unitNo) {
            toast.error("Some fields are empty", { position: 'top-right' });
            return;
        }

        const addedModule = {
            family: isTheory ? "0" : "1",
            unitNo: newModule.unitNo,
            title: newModule.title,
            desc: newModule.description,
        }

        const res = await axios.post(`/admin/upload/comp/${subjectId}`, { access_token: auth.access_token, ...addedModule });
        const data = res.data.data;

        const nm = {
            id: data._id,
            title: data.title,
            unitNo: data.no,
            desc: data.desc
        }

        setModules((prev) => ([...prev, nm]));

        handleCloseAddModule()
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
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modules.map((module, index) => (
                    <Card
                        key={module.id}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${activeModule === module
                            ? 'ring-2 ring-[#fe965e]'
                            : 'hover:shadow-lg hover:scale-105'
                            }`}
                        onClick={() => handleModuleChange(module)}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${index % 2 === 0 ? '#2A2A2A' : '#3A3A3A'} 0%, 
                                ${index % 2 === 0 ? '#3A3A3A' : '#2A2A2A'} 100%)`
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-md font-bold text-white">{isTheory ? "Module" : "Experiment"} - {module.unitNo}</CardTitle>
                            <CardTitle className="text-sm text-gray-300">{module.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
                <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                    {auth.isAdmin &&
                        <DialogTrigger asChild>
                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-md flex items-center justify-center"
                                onClick={handleAddModule}
                            >
                                <CardHeader>
                                    <CardTitle className="text-md font-bold flex items-center">
                                        <Plus className="h-6 w-6 mr-2 text-[#fe965e]" />
                                        {isTheory ? "Add Module" : "Add Experiment"}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </DialogTrigger>
                    }
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-vssemibold">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#fe965e]">Add New Module</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Module Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={newModule.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitNo" className="text-sm font-medium text-gray-700 dark:text-gray-300">Module Number</Label>
                                <Input
                                    id="unitNo"
                                    name="unitNo"
                                    type="number"
                                    value={newModule.unitNo}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Module Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={newModule.description}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseAddModule}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#fe965e] rounded-md hover:bg-[#e8854e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e]"
                                >
                                    Add Module
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div >
            {activeModule && (
                <Card className="mt-4 overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
                }}>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl text-[#fe965e]">{activeModule.title}</CardTitle>
                        <CardDescription>Download materials for this {isTheory ? "module" : "experiment"}</CardDescription>
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-300 hover:text-[#fe965e] hover:bg-[#fe965e]/10"
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
                </Card>)
            }
        </>
    )
}

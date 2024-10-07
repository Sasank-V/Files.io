import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Plus, Upload } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from '@/api/axios'
import { toast } from 'react-toastify'
import useAuth from '@/hooks/useAuth'
import uploadFile from '@/firebase/firebaseUtils'
import NoComponentsCard from '../NoComponentsCard'

export default function ModelQPComponent({ subjectId }) {
    const { auth } = useAuth();
    const [modelQPs, setModelQPs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentQP, setCurrentQP] = useState(null)
    const [isAddQPOpen, setIsAddQPOpen] = useState(false)
    const [newQP, setNewQP] = useState({
        year: new Date().getFullYear(),
        term: '',
    })
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`/learn/modelQp/${subjectId}`)
                const data = res.data.data
                setModelQPs(data)
            } catch (error) {
                console.error('Error fetching subject details:', error)
                toast.error("Failed to fetch subject details", { position: 'top-right' })
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubjectDetails()
    }, [subjectId])

    const handleQPChange = (qp) => {
        setCurrentQP(qp)
    }

    const handleAddQP = () => {
        setIsAddQPOpen(true)
    }

    const handleCloseAddQP = () => {
        setIsAddQPOpen(false)
        setNewQP({ year: new Date().getFullYear(), term: '' })
        setSelectedFile(null)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewQP(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFile(Array.from(e.target.files))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newQP.term || !selectedFile) {
            toast.error("Please fill in all fields and select a file", { position: 'top-right' })
            return
        }

        try {
            const fileName = `${newQP.term}_${newQP.year}`;
            const fileUrl = await uploadFile(selectedFile, subjectId, 'modelQPs', fileName);
            if (!fileUrl) {
                toast.error("File not uploaded", { position: 'top-right' })
                return
            }

            const newModelQP = { name: fileName, url: fileUrl };

            const response = await axios.post(`/admin/upload/modelQP/${subjectId}`, {
                access_token: auth.access_token,
                files: [newModelQP]
            })

            newModelQP.name = response.data.name;

            setModelQPs(prev => [...prev, newModelQP])
            handleCloseAddQP()
            toast.success("Model Question Paper added successfully", { position: 'top-right' })
        } catch (error) {
            console.error('Error adding model question paper:', error)
            toast.error("Failed to add model question paper", { position: 'top-right' })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#fe965e]"></div>
            </div>
        )
    }

    if (modelQPs.length === 0) {
        return (
            <NoComponentsCard text="Model Question Papers" />
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modelQPs.map((qp, index) => (
                    <Card
                        key={qp.id}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${currentQP === qp
                            ? 'ring-2 ring-[#fe965e]'
                            : 'hover:shadow-lg hover:scale-105'
                            }`}
                        onClick={() => handleQPChange(qp)}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${index % 2 === 0 ? '#2A2A2A' : '#3A3A3A'} 0%, 
                                ${index % 2 === 0 ? '#3A3A3A' : '#2A2A2A'} 100%)`
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="text-md font-bold text-white">{qp.name}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
                <Dialog open={isAddQPOpen} onOpenChange={setIsAddQPOpen}>
                    {auth.isAdmin &&
                        <DialogTrigger asChild>
                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-md flex items-center justify-center"
                                onClick={handleAddQP}
                            >
                                <CardHeader>
                                    <CardTitle className="text-md font-bold flex items-center">
                                        <Plus className="h-6 w-6 mr-2 text-[#fe965e]" />
                                        Add Model QP
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </DialogTrigger>
                    }
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#fe965e]">Add New Model Question Paper</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    value={newQP.year}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="term" className="text-sm font-medium text-gray-700 dark:text-gray-300">Term</Label>
                                <Select name="term" onValueChange={(value) => handleInputChange({ target: { name: 'term', value } })} value={newQP.term}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CAT1">CAT1</SelectItem>
                                        <SelectItem value="CAT2">CAT2</SelectItem>
                                        <SelectItem value="FAT">FAT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Question Paper (PDF)</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    className="file:mr-4 h-max p-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fe965e] file:text-white hover:file:bg-[#e8854e]"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseAddQP}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#fe965e] rounded-md hover:bg-[#e8854e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe965e]"
                                >
                                    Add Model QP
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {currentQP && (
                <Card className="mt-4 overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
                }}>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl text-[#fe965e]">{currentQP.name}</CardTitle>
                        <CardDescription>Download the question paper</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="w-full overflow-auto bg-gray-800 bg-opacity-70 rounded-lg shadow-inner">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px] text-gray-300">Details</TableHead>
                                        <TableHead className="text-right text-gray-300">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-b border-gray-700">
                                        <TableCell className="font-medium text-gray-200">
                                            <div className="flex items-center">
                                                <FileText className="h-4 w-4 text-[#fe965e] mr-2" />
                                                <span>{currentQP.year} {currentQP.term} Question Paper</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <a href={currentQP.url}>
                                                <Button
                                                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white"
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download PDF
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
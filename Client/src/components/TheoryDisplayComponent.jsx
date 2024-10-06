import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, Video, Presentation } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from '@/api/axios'

const TheoryDisplayComponent = ({ modules }) => {
    const [currentMaterials, setCurrentMaterials] = useState([]);
    const [activeModule, setActiveModule] = useState(null);

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
        </>
    )
}
export default TheoryDisplayComponent
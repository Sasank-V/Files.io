import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
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
                {modules.map((module, index) => (
                    <Card
                        key={module.id}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                            activeModule === module 
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
                            <CardTitle className="text-md font-bold text-white">Module - {module.unitNo}</CardTitle>
                            <CardTitle className="text-sm text-gray-300">{module.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            {activeModule && (
                <Card className="mt-4 overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
                }}>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl text-[#fe965e]">{activeModule.title}</CardTitle>
                        <CardTitle className="text-md text-white">Module - {activeModule.unitNo}</CardTitle>
                        <CardDescription className="text-gray-400">Download materials for this unit</CardDescription>
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
                </Card>
            )}
        </>
    )
}

export default TheoryDisplayComponent
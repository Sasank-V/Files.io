import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, Video, Presentation, Upload } from 'lucide-react'

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

const materials = [
    { name: 'Lecture Notes', icon: FileText },
    { name: 'Presentation Slides', icon: Presentation },
    { name: 'Video Lecture', icon: Video },
]

const TheoryUploadComponent = ({ subjectId }) => {
    const [activeUnit, setActiveUnit] = useState(units[0])
    const [selectedUnit, setSelectedUnit] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])

    const handleDownload = (unit, material) => {
        console.log(`Downloading ${material} for ${unit} of ${subjectId}`)
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files))
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {units.map((unit) => (
                    <Card
                        key={unit}
                        className={`cursor-pointer transition-all duration-200 ${activeUnit === unit ? 'ring-2 ring-[#fe965e]' : 'hover:shadow-md'}`}
                        onClick={() => setActiveUnit(unit)}
                    >
                        <CardHeader>
                            <CardTitle className="text-sm">{unit}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            {activeUnit && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#fe965e]">{activeUnit}</CardTitle>
                        <CardDescription>Download materials for this unit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {materials.map((material) => (
                                <Button
                                    key={material.name}
                                    onClick={() => handleDownload(activeUnit, material.name)}
                                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white"
                                >
                                    <material.icon className="mr-2 h-4 w-4" />
                                    {material.name}
                                </Button>
                            ))}
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
                                    {units.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Video, Presentation } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from '@/api/axios'

const units = [
    'Experiment 1',
    'Experiment 2',
    'Experiment 3',
    'Experiment 4',
    'Experiment 5',
    'Experiment 6',
    'Experiment 7',
    'Experiment 8',
]

const materials = [
    { name: 'Lecture Notes', icon: FileText },
    { name: 'Presentation Slides', icon: Presentation },
    { name: 'Video Lecture', icon: Video },
]

const TheoryComponent = ({ subjectId }) => {
    const [subject, setSubject] = useState({});

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        fetchSubjectDetails();
    }, [])

    const [activeUnit, setActiveUnit] = useState(units[0])

    const handleDownload = (unit, material) => {
        console.log(`Downloading ${material} for ${unit} of ${subject.name}`)
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
        </div>
    )
}

export default TheoryComponent
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Video, Presentation } from 'lucide-react'

const units = [
    'Unit 1: Introduction',
    'Unit 2: Fundamentals',
    'Unit 3: Advanced Concepts',
    'Unit 4: Applications',
    'Unit 5: Case Studies',
    'Unit 6: Modern Developments',
    'Unit 7: Research Methods',
    'Unit 8: Future Directions',
]

const materials = [
    { name: 'Lecture Notes', icon: FileText },
    { name: 'Presentation Slides', icon: Presentation },
    { name: 'Video Lecture', icon: Video },
]

const TheoryComponent = ({ subject }) => {
    const [activeUnit, setActiveUnit] = useState(units[0])

    const handleDownload = (unit, material) => {
        // This is a placeholder function for the download logic
        // In a real application, you would implement the actual download functionality here
        console.log(`Downloading ${material} for ${unit} of ${subject}`)
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
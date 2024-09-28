import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

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

const TheoryComponent = ({ subject }) => {
    const [activeUnit, setActiveUnit] = useState(null)

    return (
        <div value="theory">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {units.map((unit) => (
                    <Card key={unit} className="cursor-pointer" onClick={() => setActiveUnit(unit)}>
                        <CardHeader>
                            <CardTitle className="text-sm">{unit}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            {activeUnit && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>{activeUnit}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Detailed notes and materials for {activeUnit} will be displayed here...</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
export default TheoryComponent
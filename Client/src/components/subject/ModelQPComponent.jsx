import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from '@/api/axios'

const modelQPs = [
    { id: 1, year: 2023, term: 'Midterm' },
    { id: 2, year: 2023, term: 'Final' },
    { id: 3, year: 2022, term: 'Midterm' },
    { id: 4, year: 2022, term: 'Final' },
    { id: 5, year: 2021, term: 'Midterm' },
    { id: 6, year: 2021, term: 'Final' },
]

const ModelQPComponent = ({ subjectId }) => {
    const [subject, setSubject] = useState({});

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        fetchSubjectDetails();
    }, [])

    const handleDownload = (year, term) => {
        console.log(`Downloading ${year} ${term} model question paper for ${subject.name}`)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#fe965e]">Model Question Papers</CardTitle>
                    <CardDescription>View and download model question papers for {subject.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modelQPs.map((qp) => (
                            <Card key={qp.id} className="hover:shadow-md transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{qp.year} {qp.term}</CardTitle>
                                    <CardDescription>Model Question Paper</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={() => handleDownload(qp.year, qp.term)}
                                        className="w-full bg-[#fe965e] hover:bg-[#e8854e] text-white"
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download PDF
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ModelQPComponent
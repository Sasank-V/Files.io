import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const SyllabusComponent = ({ subject }) => {
    const handleDownload = () => {
        // This is a placeholder function for the download logic
        // In a real application, you would implement the actual download functionality here
        console.log(`Downloading ${subject} syllabus PDF`)
        // For example, you might use:
        // window.open('/path/to/syllabus.pdf', '_blank')
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-[#fe965e]">Syllabus</CardTitle>
                        <CardDescription className="mt-1">Download the complete syllabus for {subject}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Button
                    onClick={handleDownload}
                    className="bg-[#fe965e] hover:bg-[#e8854e] text-white rounded-full px-6 py-3 text-lg"
                >
                    <Download className="mr-2 h-5 w-5" /> Download Syllabus PDF
                </Button>
            </CardContent>
        </Card>
    )
}

export default SyllabusComponent
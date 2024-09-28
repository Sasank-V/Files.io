import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SyllabusComponent = ({ subject }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Syllabus Overview</CardTitle>
                    <CardDescription>A comprehensive overview of the {subject} syllabus</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Here you'll find the detailed syllabus for {subject}...</p>
                </CardContent>
            </Card>
        </div>
    )
}
export default SyllabusComponent
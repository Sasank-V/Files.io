import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AssignmentsComponent = ({ subject }) => {
    return (
        <div value="assignments">
            <Card>
                <CardHeader>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>Download assignments related to {subject}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Assignments will be available for download here...</p>
                </CardContent>
            </Card>
        </div>
    )
}
export default AssignmentsComponent
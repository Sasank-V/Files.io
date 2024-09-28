import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const LabsComponent = () => {
    return (
        <div value="labs">
            <Card>
                <CardHeader>
                    <CardTitle>Lab Assignments</CardTitle>
                    <CardDescription>Access lab assignments or experiments</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Lab assignments and experiments will be listed here...</p>
                </CardContent>
            </Card>
        </div>
    )
}
export default LabsComponent
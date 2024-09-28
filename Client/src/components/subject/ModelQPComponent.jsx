import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ModelQPComponent = ({ subject }) => {
    return (
        <div value="model-qp">
            <Card>
                <CardHeader>
                    <CardTitle>Model Question Papers</CardTitle>
                    <CardDescription>View model question papers for {subject}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Model question papers will be displayed here...</p>
                </CardContent>
            </Card>
        </div>
    )
}
export default ModelQPComponent
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const LessonPlan = ({ subject }) => {
    return (
        <div value="lesson-plan">
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Plan</CardTitle>
                    <CardDescription>Weekly lesson plans for {subject}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Detailed lesson plans will be displayed here...</p>
                </CardContent>
            </Card>
        </div>
    )
}
export default LessonPlan
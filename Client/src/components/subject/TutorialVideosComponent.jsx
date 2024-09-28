import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, Beaker, ClipboardList, FileQuestion, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TutorialVideosComponent = ({ subject }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Tutorial Videos for {subject}</CardTitle>
                    <CardDescription>Video lessons and explanations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((video) => (
                            <Card key={video}>
                                <CardHeader>
                                    <CardTitle>Video Tutorial {video}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video bg-muted flex items-center justify-center">
                                        <Video className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <p className="mt-2">Description of Video Tutorial {video}</p>
                                    <Button className="mt-2" variant="outline">
                                        Watch Video
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
export default TutorialVideosComponent
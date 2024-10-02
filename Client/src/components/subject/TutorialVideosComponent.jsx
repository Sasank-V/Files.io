import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Video, Play } from 'lucide-react'

const videos = [
    { id: 1, title: 'Introduction to the Course', duration: '15:30' },
    { id: 2, title: 'Key Concepts Explained', duration: '22:45' },
    { id: 3, title: 'Practical Examples', duration: '18:20' },
    { id: 4, title: 'Advanced Topics', duration: '25:10' },
    { id: 5, title: 'Problem Solving Techniques', duration: '20:55' },
    { id: 6, title: 'Review and Summary', duration: '16:40' },
]

const TutorialVideosComponent = ({ subjectId }) => {
    const handleWatchVideo = (videoId) => {
        // This is a placeholder function for the video playback logic
        // In a real application, you would implement the actual video playback functionality here
        console.log(`Playing video ${videoId} for ${subjectId}`)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#fe965e]">Tutorial Videos for {subjectId}</CardTitle>
                    <CardDescription>Enhance your learning with our video lessons and explanations</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card key={video.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{video.title}</CardTitle>
                            <CardDescription className="flex items-center mt-2">
                                <Video className="mr-2 h-4 w-4" />
                                Duration: {video.duration}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
                                <Video className="h-16 w-16 text-[#fe965e]" />
                            </div>
                            <Button
                                onClick={() => handleWatchVideo(video.id)}
                                className="w-full bg-[#fe965e] hover:bg-[#e8854e] text-white"
                            >
                                <Play className="mr-2 h-4 w-4" /> Watch Video
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TutorialVideosComponent
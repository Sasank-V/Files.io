import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const LoadingComponent = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold text-[#fe965e]">Loading</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-16 w-16 animate-spin text-[#fe965e]" />
                <p className="mt-4 text-lg text-gray-600">Please wait while we fetch your content...</p>
            </CardContent>
        </Card>
    )
}

export default LoadingComponent
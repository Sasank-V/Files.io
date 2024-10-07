import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

const NoComponentsCard = ({ text }) => {
    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
        }}>
            <CardHeader className="relative z-10">
                <CardTitle className="text-xl text-center text-[#fe965e]">No {text} Available</CardTitle>
                <CardDescription className="text-center text-gray-300">
                    There are currently no {text} for this subject.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center">
                <BookOpen className="w-16 h-16 text-[#fe965e] mb-4" />
                <p className="text-center mb-4 text-gray-200">
                    Check back later or explore other subjects to continue your learning journey.
                </p>
                <Button
                    variant="outline"
                    className="bg-transparent text-[#fe965e] border-[#fe965e] hover:bg-[#fe965e] hover:text-white transition-colors duration-200"
                >
                    <Link to="/learn">Explore Other Subjects</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export default NoComponentsCard
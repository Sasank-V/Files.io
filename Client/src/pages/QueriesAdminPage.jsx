import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TeacherQueriesPage = () => {
    const [queries, setQueries] = useState([
        { id: 1, studentName: "Alice", question: "What is the difference between props and state in React?", answer: "Props are passed to a component from its parent and are read-only, while state is managed within the component and can be updated using setState.", answered: true },
        { id: 2, studentName: "Bob", question: "Can you explain the concept of closures in JavaScript?", answer: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.", answered: true },
        { id: 3, studentName: "Charlie", question: "How does the virtual DOM work in React?", answer: null, answered: false },
        { id: 4, studentName: "David", question: "What are the key features of ES6?", answer: null, answered: false }
    ])

    const [currentAnswer, setCurrentAnswer] = useState('')
    const [selectedQuery, setSelectedQuery] = useState(null)

    const handleAnswerSubmit = () => {
        e.preventDefault()
        if (currentAnswer.trim() && selectedQuery) {
            setQueries(queries.map(query =>
                query.id === selectedQuery.id
                    ? { ...query, answer: currentAnswer, answered: true }
                    : query
            ))
            setCurrentAnswer('')
            setSelectedQuery(null)
        }
    }

    return (
        <main className='flex flex-col w-full min-h-screen overflow-y-auto bg-gray-50'>
            <div className="w-full p-6 md:p-10">
                <div className="w-full h-full flex flex-col justify-start items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold text-center mb-2">
                        Teacher's Query Dashboard
                    </div>
                    <div className="text-[24px] font-semibold text-[#fe965e] mb-10">
                        View and answer student queries
                    </div>
                    <Tabs defaultValue="unanswered" className="w-full max-w-[1000px]">
                        <TabsList className="grid h-max w-full grid-cols-2 bg-[#222222] p-[5px]">
                            <TabsTrigger value="unanswered" className="p-3">Unanswered Queries</TabsTrigger>
                            <TabsTrigger value="answered" className="p-3">Answered Queries</TabsTrigger>
                        </TabsList>
                        <TabsContent value="unanswered">
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-white">
                                {queries.filter(query => !query.answered).map((query) => (
                                    <div key={query.id} className="mb-6 last:mb-0 p-4 border rounded-lg">
                                        <div className="font-semibold text-[#fe965e] mb-2">Student: {query.studentName}</div>
                                        <div className="font-medium text-gray-700 mb-4">Q: {query.question}</div>
                                        <Button
                                            onClick={() => setSelectedQuery(query)}
                                            className="bg-[#fe965e] text-white"
                                        >
                                            Answer Query
                                        </Button>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="answered">
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-white">
                                {queries.filter(query => query.answered).map((query) => (
                                    <div key={query.id} className="mb-6 last:mb-0 p-4 border rounded-lg">
                                        <div className="font-semibold text-[#fe965e] mb-2">Student: {query.studentName}</div>
                                        <div className="font-medium text-gray-700 mb-2">Q: {query.question}</div>
                                        <div className="pl-4 border-l-2 border-[#f9d9c6]">A: {query.answer}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                    {selectedQuery && (
                        <form onSubmit={handleAnswerSubmit} className='w-full max-w-[1000px] mt-10'>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor="answer">Answer to: {selectedQuery.question}</Label>
                                    <Textarea
                                        id="answer"
                                        placeholder="Type your answer here..."
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#fe965e] min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center mt-[30px] w-full'>
                                <Button type="submit" className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center">
                                    Submit Answer
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    )
}

export default TeacherQueriesPage
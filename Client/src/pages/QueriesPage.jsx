import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

const QueriesPage = () => {
    const [query, setQuery] = useState('')
    const [queries, setQueries] = useState([
        { id: 1, question: "What is the difference between props and state in React?", answer: "Props are passed to a component from its parent and are read-only, while state is managed within the component and can be updated using setState.", answered: true },
        { id: 2, question: "Can you explain the concept of closures in JavaScript?", answer: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.", answered: true },
        { id: 3, question: "How does the virtual DOM work in React?", answer: null, answered: false },
        { id: 4, question: "What are the key features of ES6?", answer: null, answered: false },
        { id: 5, question: "What is the difference between props and state in React?", answer: "Props are passed to a component from its parent and are read-only, while state is managed within the component and can be updated using setState.", answered: true },
        { id: 6, question: "Can you explain the concept of closures in JavaScript?", answer: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.", answered: true },
        { id: 7, question: "How does the virtual DOM work in React?", answer: null, answered: false },
        { id: 8, question: "What are the key features of ES6?", answer: null, answered: false }
    ])

    const handleSubmit = () => {
        e.preventDefault()
        if (query.trim()) {
            setQueries([...queries, { id: queries.length + 1, question: query, answer: null, answered: false }])
            setQuery('')
        }
    }

    return (
        <main className='flex flex-col w-full min-h-screen overflow-y-auto bg-gray-50'>
            <div className="w-full p-6 md:p-10">
                <div className="w-full h-full flex flex-col justify-start items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold text-center mb-2">
                        Student Queries
                    </div>
                    <div className="text-[24px] font-semibold text-[#fe965e] mb-10">
                        Ask your questions and view responses
                    </div>
                    <form onSubmit={handleSubmit} className='w-full max-w-[800px] mb-10'>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor="query">Your Query</Label>
                                <Textarea
                                    id="query"
                                    placeholder="Type your question here..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#fe965e] min-h-[100px]"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center mt-[30px] w-full'>
                            <Button type="submit" className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center">
                                Submit Query
                            </Button>
                        </div>
                    </form>
                    <div className="w-full max-w-[800px] grid md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Previous Questions</h2>
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white">
                                {queries.map((item) => (
                                    <div key={item.id} className="mb-4 last:mb-0 flex justify-between items-start">
                                        <div className="font-medium text-gray-700 mr-2">{item.question}</div>
                                        <Badge variant={item.answered ? "success" : "secondary"} className="ml-2 shrink-0">
                                            {item.answered ? "Answered" : "Pending"}
                                        </Badge>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Responses</h2>
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white">
                                {queries.filter(item => item.answered).map((item) => (
                                    <div key={item.id} className="mb-6 last:mb-0">
                                        <div className="font-semibold text-[#fe965e]">Q: {item.question}</div>
                                        <div className="mt-2 pl-4 border-l-2 border-[#f9d9c6]">A: {item.answer}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default QueriesPage
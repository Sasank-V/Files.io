'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { toast } from 'react-toastify'

const TeacherQueriesPage = () => {
    const [queries, setQueries] = useState([])
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [selectedQuery, setSelectedQuery] = useState(null)
    const { auth } = useAuth()

    useEffect(() => {
        fetchQueries()
    }, [])

    const fetchQueries = async () => {
        try {
            const response = await axios.post('/query/all', { access_token: auth.access_token })
            setQueries(response.data.queries)
        } catch (error) {
            console.error('Error fetching queries:', error)
            toast.error('Failed to fetch queries')
        }
    }

    const handleAnswerSubmit = async (e) => {
        e.preventDefault()
        if (currentAnswer.trim() && selectedQuery) {
            try {
                await axios.put(`/query/reply/admin/${selectedQuery._id}`, {
                    reply: currentAnswer,
                    access_token: auth.access_token
                })
                toast.success('Answer submitted successfully')
                setCurrentAnswer('')
                setSelectedQuery(null)
                fetchQueries()
            } catch (error) {
                console.error('Error submitting answer:', error)
                toast.error('Failed to submit answer')
            }
        }
    }

    return (
        <main className='flex w-full h-full overflow-y-scroll'>
            <div className="md:w-[50%] w-full p-10">
                <div className="w-full h-full flex flex-col p-10 justify-center items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold justify-start text-center">
                        Teacher's Query Dashboard
                    </div>
                    <div className="text-[24px] font-semibold text-[#fe965e] mt-2 mb-10">
                        View and answer student queries
                    </div>
                    {selectedQuery && (
                        <form onSubmit={handleAnswerSubmit} className='w-full max-w-[600px] mt-10'>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor="answer" className="text-gray-700">Answer to: {selectedQuery.ques}</Label>
                                    <Textarea
                                        id="answer"
                                        placeholder="Type your answer here..."
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] min-h-[100px] bg-white text-gray-900 border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center mt-[50px] w-full'>
                                <Button type="submit" className="w-[200px] bg-[#fe965e] hover:bg-[#e8854e] rounded-md p-3 text-lg text-white text-center">
                                    Submit Answer
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className='md:flex hidden w-[50%] justify-center h-[95vh]'>
                <div className='w-[90%] h-[90%] rounded-lg bg-[#f9d9c6] flex flex-col items-center justify-start p-6 overflow-hidden'>
                    <Tabs defaultValue="unanswered" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-[#222222] text-white rounded-xl h-max border-[1px] text-center mb-2">
                            <TabsTrigger value="unanswered" className="p-3 data-[state=active]:bg-[#fe965e] data-[state=active]:text-white rounded-lg">Unanswered Queries</TabsTrigger>
                            <TabsTrigger value="answered" className="p-3 data-[state=active]:bg-[#fe965e] data-[state=active]:text-white rounded-lg">Answered Queries</TabsTrigger>
                        </TabsList>
                        <TabsContent value="unanswered">
                            <ScrollArea className="h-[calc(90vh-120px)] w-full rounded-md border border-[#fe965e] p-4 bg-gray-800">
                                {queries.filter(query => !query.status).map((query) => (
                                    <div key={query._id} className="mb-6 last:mb-0 p-4 border border-gray-700 rounded-lg">
                                        <div className="font-semibold text-[#fe965e] mb-2">Student: {query.from.name}</div>
                                        <div className="font-medium text-gray-200 mb-4">Q: {query.ques}</div>
                                        <Button
                                            onClick={() => setSelectedQuery(query)}
                                            className="bg-[#fe965e] text-white hover:bg-[#e8854e]"
                                        >
                                            Answer Query
                                        </Button>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="answered">
                            <ScrollArea className="h-[calc(90vh-120px)] w-full rounded-md border border-[#fe965e] p-4 bg-gray-800">
                                {queries.filter(query => query.status).map((query) => (
                                    <div key={query._id} className="mb-6 last:mb-0 p-4 border border-gray-700 rounded-lg">
                                        <div className="font-semibold text-[#fe965e] mb-2">Student: {query.from.name}</div>
                                        <div className="font-medium text-gray-200 mb-2">Q: {query.ques}</div>
                                        <div className="pl-4 border-l-2 border-[#fe965e] text-gray-300">A: {query.res}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    )
}

export default TeacherQueriesPage
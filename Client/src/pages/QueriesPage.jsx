'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { toast } from 'react-toastify'

export default function QueryPage() {
  const [query, setQuery] = useState('')
  const [queries, setQueries] = useState([])
  const [admins, setAdmins] = useState([])
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const { auth } = useAuth()

  useEffect(() => {
    fetchQueries()
    fetchAdmins()
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

  const fetchAdmins = async () => {
    try {
      const response = await axios.post('/query/admins', { access_token: auth.access_token })
      setAdmins(response.data.data)
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to fetch admins')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (query.trim() && selectedAdmin) {
      try {
        await axios.post('/query/post', {
          to: selectedAdmin, ques: query, type: 0,
          access_token: auth.access_token
        })
        toast.success('Query submitted successfully')
        setQuery('')
        fetchQueries()
      } catch (error) {
        console.error('Error submitting query:', error)
        toast.error('Failed to submit query')
      }
    }
  }

  const handleEdit = async (queryId, newQuestion) => {
    try {
      await axios.put(`/query/edit/${queryId}`, {
        data: { ques: newQuestion },
        access_token: auth.access_token
      })
      toast.success('Query updated successfully')
      fetchQueries()
    } catch (error) {
      console.error('Error updating query:', error)
      toast.error('Failed to update query')
    }
  }

  return (
    <main className='flex w-full h-full overflow-y-scroll bg-white'>
      <div className="md:w-[50%] w-full p-10">
        <div className="w-full h-full flex flex-col p-10 justify-center items-center">
          <div className="md:text-[60px] text-[30px] font-semibold justify-start text-center text-gray-800">
            Student Queries
          </div>
          <div className="text-[24px] font-semibold text-[#fe965e] mt-2 mb-10">
            Ask your questions and view responses
          </div>
          <form onSubmit={handleSubmit} className='w-full max-w-[400px]'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor="admin" className="text-gray-700">Select Admin</Label>
                <select
                  id="admin"
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] bg-white text-gray-900 border-gray-300"
                >
                  <option value="">Select an admin</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>{admin.name}</option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor="query" className="text-gray-700">Your Query</Label>
                <Textarea
                  id="query"
                  placeholder="Type your question here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe965e] min-h-[100px] bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>
            <div className='flex justify-center mt-[50px] w-full'>
              <Button type="submit" className="w-[200px] bg-[#fe965e] hover:bg-[#e8854e] rounded-md p-3 text-lg text-white text-center">
                Submit Query
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className='md:flex hidden w-[50%] justify-center h-[95vh]'>
        <div className='w-[90%] h-[90%] flex flex-col items-center justify-center p-6 bg-[#f9d9c6] rounded-lg shadow-lg'>
          <h2 className="text-2xl font-semibold mb-4 text-[#fe965e]">Your Queries</h2>
          <ScrollArea className="h-[300px] w-full rounded-md border border-[#fe965e] p-4 bg-[#222222] mb-6">
            {queries.map((item, index) => (
              <div key={item._id} className={`py-4 ${index !== queries.length - 1 ? 'border-b border-gray-700' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-200 mr-2">{item.ques}</div>
                  <Badge variant={item.status ? "success" : "secondary"} className={`ml-2 shrink-0 ${item.status ? 'bg-green-600' : 'bg-[#fe965e]'}`}>
                    {item.status ? "Answered" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </ScrollArea>
          <h2 className="text-2xl font-semibold mb-4 text-[#fe965e]">Responses</h2>
          <ScrollArea className="h-[300px] w-full rounded-md border border-[#fe965e] p-4 bg-[#222222]">
            {queries.filter(item => item.status).map((item, index) => (
              <div key={item._id} className={`py-4 ${index !== queries.filter(q => q.status).length - 1 ? 'border-b border-gray-700' : ''}`}>
                <div className="font-semibold text-gray-200">Q: {item.ques}</div>
                <div className="mt-2 pl-4 border-l-2 border-[#fe965e] text-gray-300">A: {item.res}</div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </main>
  )
}
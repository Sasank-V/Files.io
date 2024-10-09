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
      const response = await axios.post('/api/query/all', { id: auth.userId, access_token: auth.access_token })
      setQueries(response.data.queries)
    } catch (error) {
      console.error('Error fetching queries:', error)
      toast.error('Failed to fetch queries')
    }
  }

  const fetchAdmins = async () => {
    try {
      const response = await axios.post('/api/query/admins', { access_token: auth.access_token })
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
        await axios.post('/api/query/post', {
          data: { to: selectedAdmin, ques: query, type: 0 },
          id: auth.userId,
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
      await axios.put(`/api/query/edit/${queryId}`, {
        data: { ques: newQuestion },
        id: auth.userId,
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
    <main className='flex flex-col w-full min-h-screen overflow-y-auto bg-black text-gray-300'>
      <div className="w-full p-6 md:p-10">
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="md:text-[60px] text-[30px] font-semibold text-center mb-2 text-gray-100">
            Student Queries
          </div>
          <div className="text-[24px] font-semibold text-gray-400 mb-10">
            Ask your questions and view responses
          </div>
          <form onSubmit={handleSubmit} className='w-full max-w-[800px] mb-10'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor="admin" className="text-gray-400">Select Admin</Label>
                <select
                  id="admin"
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-gray-100 border-gray-700"
                >
                  <option value="">Select an admin</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>{admin.name}</option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor="query" className="text-gray-400">Your Query</Label>
                <Textarea
                  id="query"
                  placeholder="Type your question here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[100px] bg-gray-800 text-gray-100 border-gray-700"
                />
              </div>
            </div>
            <div className='flex justify-center mt-[30px] w-full'>
              <Button type="submit" className="w-[200px] bg-gray-700 hover:bg-gray-600 rounded-full p-3 text-lg text-white text-center transition-colors duration-200">
                Submit Query
              </Button>
            </div>
          </form>
          <div className="w-full max-w-[800px] grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">Your Queries</h2>
              <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4 bg-gray-900">
                {queries.map((item) => (
                  <div key={item._id} className="mb-4 last:mb-0 flex justify-between items-start">
                    <div className="font-medium text-gray-300 mr-2">{item.ques}</div>
                    <Badge variant={item.status ? "success" : "secondary"} className={`ml-2 shrink-0 ${item.status ? 'bg-green-600' : 'bg-gray-600'}`}>
                      {item.status ? "Answered" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">Responses</h2>
              <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700 p-4 bg-gray-900">
                {queries.filter(item => item.status).map((item) => (
                  <div key={item._id} className="mb-6 last:mb-0">
                    <div className="font-semibold text-gray-400">Q: {item.ques}</div>
                    <div className="mt-2 pl-4 border-l-2 border-gray-700 text-gray-300">A: {item.res}</div>
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
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const faqData = [
  {
    question: 'How do I upload materials as a teacher?',
    answer: 'Teachers can upload materials by logging in and navigating to the "Upload Materials" section on their dashboard.',
  },
  {
    question: 'Can students upload their own study materials?',
    answer: 'Currently, only teachers have the ability to upload materials. Students can access and download the materials shared by their teachers.',
  },
  {
    question: 'How can I contact my teacher directly?',
    answer: 'You can use the "Ask a Query" feature on this page to post a question. Your teacher will be notified and can respond to your query.',
  },
]

export function QueriesComponent() {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the query to your backend
    console.log('Query submitted:', query)
    setQuery('')
  }

  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Queries</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Query</CardTitle>
            <CardDescription>Post your question here and get answers from teachers and peers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Type your question here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-4" />
              <Button type="submit">Submit Query</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}
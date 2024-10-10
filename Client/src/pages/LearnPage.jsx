'use client'

import { useRef, useEffect, useState } from 'react'
import axios from "@/api/axios"
import LoadingComponent from "@/components/loading"
import CustomCard from "@/components/ui/CustomCard"
import useAuth from "@/hooks/useAuth"
import { Plus, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import gsap from 'gsap'

const AddSubjectCard = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [onCard, setOnCard] = useState(false)

  const cardRef = useRef(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const arrowRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onAdd(subjectName, subjectCode)
      setIsOpen(false)
      setSubjectName('')
      setSubjectCode('')
      toast.success('New subject created successfully')
    } catch (error) {
      console.error('Error creating new subject:', error)
      toast.error('Failed to create new subject')
    }
  }

  useEffect(() => {
    const card = cardRef.current
    const overlay = overlayRef.current
    const content = contentRef.current
    const arrow = arrowRef.current

    gsap.set(overlay, { scaleY: 0, transformOrigin: 'bottom' })
    gsap.set(arrow, { x: -20, opacity: 0 })

    const enterAnimation = gsap.timeline({ paused: true })
    enterAnimation
      .to(overlay, { scaleY: 1, duration: 0.5, ease: "power2.out" })
      .to(content, { y: -10, duration: 0.5, ease: "power2.out" }, 0)
      .to(arrow, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.2)

    const leaveAnimation = gsap.timeline({ paused: true })
    leaveAnimation
      .to(overlay, { scaleY: 0, duration: 0.5, ease: "power2.in" })
      .to(content, { y: 0, duration: 0.5, ease: "power2.in" }, 0)
      .to(arrow, { x: -20, opacity: 0, duration: 0.3, ease: "power2.in" }, 0)

    const handleEnter = () => enterAnimation.play()
    const handleLeave = () => leaveAnimation.play()

    card.addEventListener('mouseenter', handleEnter)
    card.addEventListener('mouseleave', handleLeave)

    return () => {
      card.removeEventListener('mouseenter', handleEnter)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [onCard])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='w-full h-full flex justify-center font-vssemibold'>
          <div
            ref={cardRef}
            className="relative h-[300px] w-[300px] rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl"
            onPointerEnter={() => setOnCard(true)}
            onPointerLeave={() => setOnCard(false)}
          >
            <div className='h-full overflow-hidden bg-gradient-to-br '
                style={{background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'}}
            >
              <Plus className="w-24 h-24 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div
              ref={overlayRef}
              className='absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent opacity-90'
            ></div>
            <div
              ref={contentRef}
              className='absolute bottom-0 left-0 right-0 p-6 text-white z-20 transition-transform duration-300'
            >
              <h3 className='text-2xl  mb-2'>Add New Subject</h3>
              <div className='flex items-center'>
                <span className='text-sm mr-2'>Create</span>
                <ArrowRight ref={arrowRef} size={16} />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br text-gray-100 border border-gray-700 font-vssemibold" style={{background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'}}>
        <DialogHeader>
          <DialogTitle className="text-orange-400">Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subjectName" className="text-gray-300">Subject Name</Label>
            <Input 
              id="subjectName" 
              value={subjectName} 
              onChange={(e) => setSubjectName(e.target.value)}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <Label htmlFor="subjectCode" className="text-gray-300">Subject Code</Label>
            <Input 
              id="subjectCode" 
              value={subjectCode} 
              onChange={(e) => setSubjectCode(e.target.value)}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-orange-400"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold">
            Create Subject
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const LearnPage = () => {
    const [subjects, setSubjects] = useState([])
    const [subFetched, setSubFetched] = useState(false)
    const { auth } = useAuth()

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get("/learn/all")
                const data = res.data.data
                console.log(data);
                setSubjects(data)
                setSubFetched(true)
            } catch (error) {
                console.error('Error fetching subjects:', error)
                toast.error('Failed to fetch subjects')
                setSubFetched(true)
            }
        }

        fetchSubjects()
    }, [])

    const handleAddSubject = async (name, code) => {
        try {
            const res = await axios.post("/admin/upload/subject/new", { 
                name,
                code,
                access_token : auth.access_token,
            })
            const newSubId = res.data.subId;
            setSubjects([...subjects,{name : name, code : code, id: newSubId}]);
        } catch (error) {
            console.error('Error creating new subject:', error)
            throw error
        }
    }

    if (!subFetched) {
        return (
            <div className="w-full h-full">
                <LoadingComponent text="Loading" />
            </div>
        )
    }

    return (
        <div className="p-5 h-full w-full overflow-y-scroll" >
            <div className='p-5 w-full h-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6'>
                {auth.isAdmin && (
                    <div className="p-2 h-full">
                        <AddSubjectCard onAdd={handleAddSubject} />
                    </div>
                )}
                {subjects.map((subject) => (
                    <div key={subject.id} id="card" className="p-2">
                        <CustomCard subjectData={subject} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LearnPage
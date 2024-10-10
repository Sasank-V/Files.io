"use client"

import { useState, useEffect } from "react"
import { Tabs } from "@/components/ui/tabs"
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronDown, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios, { axiosPrivate } from "@/api/axios"
import useAuth from "@/hooks/useAuth"
import { CardContent } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import LoadingComponent from "./loading"

export function Subject() {
  const location = useLocation()
  const navigate = useNavigate()
  const [subject, setSubject] = useState({})
  const [subjectAdmin, setSubjectAdmin] = useState("")
  const { auth } = useAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading,setLoading] = useState(false);

  const subjectId = new URLSearchParams(location.search).get("id")

  const queryParams = new URLSearchParams({
    id: subjectId,
  }).toString()

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const res = await axios.get(`/learn/${subjectId}`)
      setSubject(res.data.data)
    }
    setLoading(true);
    fetchSubjectDetails()
    setLoading(false);
  }, [subjectId])

  useEffect(() => {
    const fetchSubjectAdminDetails = async () => {
      const res = await axiosPrivate.get(`/auth/details/${subject.admin}`)

      const data = res.data
      setSubjectAdmin(data.name)
    }
    setLoading(true);
    fetchSubjectAdminDetails()
    setLoading(false);
  }, [subject])

  const handleDeleteSubject = async () => {
    if (deleteConfirmation !== `DEL_${subject.name}`) {
      toast.error("Incorrect confirmation text. Please try again.")
      return
    }
    setLoading(true);
    try {
      await axios.delete(`/admin/delete/all/${subjectId}`, {
        data: { access_token: auth.access_token }
    });
    setLoading(false);
      toast.success("Subject deleted successfully")
      setIsDeleteDialogOpen(false)
      navigate("/learn")
    } catch (error) {
      console.error('Error deleting subject:', error)
      toast.error("Failed to delete subject. Please try again.")
    }
  }

  const navItems = [
    { path: `/subject/0?${queryParams}`, label: "Syllabus" },
    { path: `/subject/1?${queryParams}`, label: "Lesson Plan" },
    { path: `/subject/2?${queryParams}`, label: "Theory" },
    { path: `/subject/3?${queryParams}`, label: "Labs" },
    { path: `/subject/4?${queryParams}`, label: "Assignments" },
    { path: `/subject/5?${queryParams}`, label: "Model QP" },
    { path: `/subject/6?${queryParams}`, label: "Reference Links" },
  ]

  const [activeTab, setActiveTab] = useState(() => {
    const currentItem = navItems.find((item) => item.path === location.pathname)
    return currentItem ? currentItem.label : navItems[0].label
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold text-[#fe965e]">{`${subject.name}`}</h1>
          <div className="ml-4 px-4 py-1 bg-[#fe965e] text-white text-sm rounded-full flex justify-center items-center">
            {subjectAdmin}
          </div>
        </div>
        <div>
        {auth.isAdmin && (
          <CardContent>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#222222] text-white border-[#fe965e]">
                <DialogHeader>
                  <DialogTitle className="text-[#fe965e]">Delete Subject</DialogTitle>
                </DialogHeader>
                {loading ? <div className="w-full h-[350px]">
                  <LoadingComponent text="Deleting subject"/>
                </div> :
                <div className="space-y-4">
                  <p>Are you sure you want to delete this subject? This action cannot be undone.</p>
                  <p>To confirm, please type "DEL_{subject.name}" below:</p>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="bg-[#333333] text-white border-[#fe965e]"
                  />
                  <Button
                    onClick={handleDeleteSubject}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Confirm Delete
                  </Button>
                </div>}
              </DialogContent>
            </Dialog>
          </CardContent>
        )}
        </div>
      </div>
      <Tabs defaultValue="syllabus">
        <div className="md:hidden mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-[#222222] text-white border-[#fe965e] hover:bg-[#333333] hover:text-[#fe965e] p-6"
              >
                {activeTab} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-[610px] md:hidden bg-[#222222] border-[#fe965e]">
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  className="focus:bg-[#fe965e] focus:text-white"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full p-2 ${isActive ? "text-[#fe965e]" : "text-white"
                      } hover:text-white font-vsregular`
                    }
                    onClick={() => setActiveTab(item.label)}
                  >
                    {item.label}
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:grid w-full grid-cols-7 bg-[#222222] text-white p-[5px] rounded-xl border-[1px] border-[#fe965e] text-center mb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-[#fe965e] shadow-lg p-3 rounded-lg"
                  : "p-3 hover:bg-[#333333] hover:text-[#fe965e]"
              }
              onClick={() => setActiveTab(item.label)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </Tabs>

      <Outlet />
    </div>
  )
}
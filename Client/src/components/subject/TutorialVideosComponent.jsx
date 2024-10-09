'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Video, ExternalLink, Plus, Trash2 } from 'lucide-react'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { toast } from 'react-toastify'

export default function TutorialVideosComponent({ subjectId }) {
    const { auth } = useAuth();
    const [videos, setVideos] = useState([]);
    const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
    const [newVideo, setNewVideo] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`/learn/refs/${subjectId}`, { access_token: auth.access_token });
                setVideos(res.data.data)
            } catch (error) {
                console.error('Error fetching subject details:', error)
                toast.error("Failed to fetch videos", { position: 'top-right' })
            }
        }

        fetchVideos()
    }, [subjectId, auth.access_token])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newVideo) {
            toast.error("Video URL is required", { position: 'top-right' })
            return
        }

        try {
            await axios.post(`/admin/upload/refs/${subjectId}`, { access_token: auth.access_token, refs: [newVideo] });
            setVideos(prev => [...prev, newVideo])
            toast.success("Video added successfully", { position: 'top-right' })
            setIsAddVideoOpen(false)
            setNewVideo("")
        } catch (err) {
            toast.error("Failed to add video", { position: 'top-right' })
            console.error(err)
        }
    }

    const handleDeleteVideo = async (videoUrl) => {
        if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
            try {
                await axios.delete(`/admin/delete/refs/${subjectId}`, {
                    data: { access_token: auth.access_token, ref: videoUrl }
                });
                setVideos(videos.filter(video => video !== videoUrl));
                toast.success("Video deleted successfully", { position: 'top-right' });
            } catch (error) {
                console.error('Error deleting video:', error);
                toast.error("Failed to delete video", { position: 'top-right' });
            }
        }
    }

    return (
        <Card className="w-full overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
        }}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
                <div>
                    <CardTitle className="text-2xl font-bold text-[#fe965e]">Tutorial Videos</CardTitle>
                    <CardDescription className="text-gray-400">Watch tutorial videos for this subject</CardDescription>
                </div>
                {auth.isAdmin && (
                    <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-[#fe965e] hover:bg-[#e8854e] text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Video
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-[#fe965e]">Add New Video</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-gray-300">Video URL</Label>
                                    <Input
                                        id="url"
                                        name="url"
                                        value={newVideo}
                                        onChange={(e) => setNewVideo(e.target.value)}
                                        required
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAddVideoOpen(false)}
                                        className="bg-gray-700 text-white hover:bg-gray-600">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-[#fe965e] hover:bg-[#e8854e] text-white">
                                        Add Video
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-auto bg-gray-800 bg-opacity-70 rounded-lg shadow-inner">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-300">Title</TableHead>
                                <TableHead className="text-gray-300">Video Link</TableHead>
                                <TableHead className="text-right text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {videos.map((video, i) => (
                                <TableRow key={i} className="border-b border-gray-700">
                                    <TableCell className="font-medium text-gray-200">Video - {i + 1}</TableCell>
                                    <TableCell className="text-gray-300">
                                        <div className="flex items-center">
                                            <Video className="mr-2 h-4 w-4 text-[#fe965e]" />
                                            {video}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <a href={video} target="_blank" rel="noopener noreferrer">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-[#fe965e] text-gray-300"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Watch
                                                </Button>
                                            </a>
                                            {auth.isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-red-500 text-gray-300"
                                                    onClick={() => handleDeleteVideo(video)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
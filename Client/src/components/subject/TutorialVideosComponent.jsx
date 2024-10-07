"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Video, ExternalLink, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { toast } from 'react-toastify'

export default function TutorialVideosComponent({ subjectId }) {
    const { auth } = useAuth();
    const [videos, setVideos] = useState([]);
    const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
    const [newVideo, setNewVideo] = useState("");

    useEffect(() => {
        const fetchVidoes = async () => {
            try {
                const res = await axios.get(`/learn/refs/${subjectId}`, { access_token: auth.access_token });
                console.log(res);
                setVideos(res.data.data)
            } catch (error) {
                console.error('Error fetching subject details:', error)
            }
        }

        fetchVidoes()
    }, [subjectId])

    const handleWatchVideo = (videoId) => {
        console.log(`Redirecting to video ${videoId} for`)
        // Implement your redirection logic here
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!newVideo) {
            toast.error("All fields are required", { position: 'top-right' })
            return
        }

        try {
            const response = await axios.post(`/admin/upload/refs/${subjectId}`, { access_token: auth.access_token, refs: [newVideo] });

            setVideos(prev => [...prev, newVideo])
            toast.success("Video added successfully", { position: 'top-right' })
            setIsAddVideoOpen(false)
            setNewVideo("")
        } catch (err) {
            toast.error("Failed to add video", { position: 'top-right' })
            console.error(err)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold text-primary">Tutorial Videos</CardTitle>
                </div>
                {auth.isAdmin && (
                    <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Video
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-primary">Add New Video</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="url">Video URL</Label>
                                    <Input
                                        id="url"
                                        name="url"
                                        value={newVideo.url}
                                        onChange={(e) => setNewVideo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAddVideoOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add Video</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Video Link</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">Video - {i + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {video}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <a href={video}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:text-primary"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Watch
                                        </Button>
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
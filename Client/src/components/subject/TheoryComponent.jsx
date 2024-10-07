import { useState, useEffect } from 'react'
import axios from '@/api/axios'
import TheoryDisplayComponent from '../TheoryDisplayComponent'
import NoComponentsCard from '../NoComponentsCard'

export default function TheoryComponent({ subjectId }) {
    const [modules, setModules] = useState([])

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await axios.get(`/learn/module/all/${subjectId}/0`)
                setModules(res.data.data)
            } catch (error) {
                console.error('Error fetching modules:', error)
            }
        }

        fetchModules()
    }, [subjectId])
    return (
        <div className="space-y-6">
            {
                modules.length > 0
                    ? <TheoryDisplayComponent modules={modules} />
                    : <NoComponentsCard text="Modules" />
            }
        </div>
    )
}
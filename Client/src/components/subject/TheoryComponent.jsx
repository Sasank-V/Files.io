import { useState, useEffect } from 'react'
import axios from '@/api/axios'
import TheoryDisplayComponent from '../TheoryDisplayComponent'

const TheoryComponent = ({ subjectId }) => {
    // const [subject, setSubject] = useState({});
    const [modules, setModules] = useState([])

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await axios.get(`/learn/module/all/${subjectId}/0`)
                let data = res.data.data

                console.log(data);
                setModules(data)
            } catch (error) {
                console.error('Error fetching modules:', error)
            }
        }

        fetchModules();
    }, [subjectId])

    return (
        <div className="space-y-6">
            <TheoryDisplayComponent modules={modules} />
        </div>
    )
}

export default TheoryComponent
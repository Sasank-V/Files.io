import { useState, useEffect } from 'react'
import axios from '@/api/axios'
import TheoryDisplayComponent from '../TheoryDisplayComponent'

const LabsComponent = ({ subjectId }) => {
    // const [subject, setSubject] = useState({});
    const [modules, setModules] = useState([])

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await axios.get(`/learn/module/all/${subjectId}/1`)
                let data = res.data.data

                console.log(data);
                setModules(data)
            } catch (error) {
                console.error('Error fetching experiments:', error)
            }
        }

        fetchModules();
    }, [subjectId])

    return (
        <div className="space-y-6">
            <TheoryDisplayComponent modules={modules} isTheory={false} />
        </div>
    )
}

export default LabsComponent
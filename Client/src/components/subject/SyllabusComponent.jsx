import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from '@/api/axios'
import SyllabusLessonViewComponent from '../SyllabusLessonViewComponent'

const SyllabusComponent = ({ subjectId }) => {
    const [subject, setSubject] = useState({});
    const [currentSyllabus, setCurrentSyllabus] = useState({ filename: "", url: "" });

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        const fetchSyllabusDetails = async () => {
            const res = await axios.get(`/learn/syll/${subjectId}`);
            const syllabus = res.data.data;

            setCurrentSyllabus((prev) => ({ ...prev, filename: syllabus?.name, url: syllabus?.url }));

        }

        fetchSubjectDetails();
        fetchSyllabusDetails();
    }, [])

    return (
        <SyllabusLessonViewComponent subject={subject} current={currentSyllabus} />
    )
}

export default SyllabusComponent
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from '@/api/axios'
import SyllabusLessonViewComponent from '../SyllabusLessonViewComponent'

const LessonPlan = ({ subjectId }) => {
    const [subject, setSubject] = useState({});
    const [currentLessonPlan, setCurrentLessonPlan] = useState({ filename: "", url: "" });

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            const res = await axios.get(`/learn/${subjectId}`);
            const data = res.data;

            setSubject(data.data);
        }

        const fetchLessonPlanDetails = async () => {
            const res = await axios.get(`/learn/lp/${subjectId}`);
            const lp = res.data.data;

            setCurrentLessonPlan((prev) => ({ ...prev, filename: lp?.name, url: lp?.url }));

            console.log(res);
        }

        fetchSubjectDetails();
        fetchLessonPlanDetails();
    }, [])

    return (
        <SyllabusLessonViewComponent subject={subject} current={currentLessonPlan} isSyllabus={false} />
    )
}

export default LessonPlan
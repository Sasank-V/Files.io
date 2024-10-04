import axios from "@/api/axios";
import CustomCard from "@/components/ui/CustomCard"
import useAuth from "@/hooks/useAuth";
import useSubjects from "@/hooks/useSubjects";
import { useEffect, useState } from "react"

const LearnPage = () => {
    const { auth } = useAuth();
    const { subjects, setSubjects } = useSubjects();

    useEffect(() => {
        const fetchSubjects = async () => {
            const res = await axios.get("/learn/all");

            const data = res.data.data;
            console.log(data)
            setSubjects(data);
        }

        fetchSubjects();

    }, [])


    return (
        <div className="p-5 h-full w-full overflow-y-scroll">
            <div className='p-5 w-full h-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-[50px]'>
                {
                    subjects.map((subject) => (
                        <CustomCard key={subject.id} subjectData={subject} />
                    ))
                }
            </div>
        </div>
    )
}
export default LearnPage
import axios from "@/api/axios";
import LoadingComponent from "@/components/loading";
import CustomCard from "@/components/ui/CustomCard"
import useAuth from "@/hooks/useAuth";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDebugValue, useEffect, useState } from "react"

import useSubjects from "@/hooks/useSubjects";
import { useEffect, useState } from "react"


const LearnPage = () => {
    const { auth } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [subFetched,setSubFetched] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            const res = await axios.get("/learn/all");

            const data = res.data.data;
            setSubjects(data);
            setSubFetched(true);
        }

        fetchSubjects();
    }, []);

    if(!subFetched){
        return (
        <div className="w-full h-full">
             <LoadingComponent/>
        </div>
        )
    }
    return (
        <div className="p-5 h-full w-full overflow-y-scroll">
            <div className='p-5 w-full h-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-[50px]'>
                {console.log("Subjects" + subjects[0])}
                {
                    subjects.map((subject) => (
                        <div key={subject.id} id="card">
                            <CustomCard key={subject.id} subjectData={subject} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default LearnPage
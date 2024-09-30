import CustomCard from "@/components/ui/CustomCard"
import { useEffect } from "react"

const LearnPage = () => {
    useEffect(() => {

        const fetchCookie = async () => {
            const res = await fetch(`${import.meta.env.VITE_REACT_API_URL}/user/query`, {
                "method": "GET",
            });

            if (res.ok) {
                console.log("first")
            } else {
                console.log("sec")
            }
        }

        fetchCookie();

    }, [])


    return (
        <div className="p-5 h-full w-full overflow-y-scroll">
            <div className='p-5 w-full h-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-[50px]'>
                <CustomCard />
                <CustomCard />
                <CustomCard />
                <CustomCard />
                <CustomCard />
                <CustomCard />
                <CustomCard />
                <CustomCard />
            </div>
        </div>
    )
}
export default LearnPage
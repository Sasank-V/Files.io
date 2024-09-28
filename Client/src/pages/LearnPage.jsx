import CustomCard from "@/components/ui/CustomCard"

const LearnPage = () => {
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
import { Link } from 'react-router-dom'


const HomePage = () => {
    return (
        <main className='flex w-full h-full overflow-y-scroll'>
            <div className="md:w-[50%] w-full p-10">
                <div className="w-full h-full flex flex-col p-10 justify-center items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold justify-start">
                        Building tomorrow's sloutions today
                    </div>
                    <div className="text-[60px] font-semibold line-clamp-2 translate-y-[-20px]"></div>
                    <div className='mt-10'>Streamline your teaching experience by easily uploading and organizing course materials</div>
                    <div className='flex justify-start mt-[50px] w-full'>
                        <Link to="/learn" variant="outline" className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center">
                            Learn
                        </Link>
                    </div>
                </div>
            </div>
            <div className='md:flex hidden w-[50%] justify-center h-[95vh]'>
                <div className='w-[60%] h-[90%] rounded-b-full bg-[#f9d9c6]' />
            </div>
        </main>

    )
}
export default HomePage
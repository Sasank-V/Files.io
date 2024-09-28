import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
    return (
        <main className='flex w-full h-full overflow-y-scroll'>
            <div className="md:w-[50%] w-full p-10">
                <div className="w-full h-full flex flex-col p-10 justify-center items-center">
                    <div className="md:text-[60px] text-[30px] font-semibold justify-start text-center">
                        Oops! Page not found
                    </div>
                    <div className="text-[60px] font-semibold line-clamp-2 translate-y-[-20px]">
                        404
                    </div>
                    <div className='mt-10 text-center'>
                        The page you're looking for doesn't exist or has been moved.
                    </div>
                    <div className='flex justify-center mt-[50px] w-full'>
                        <Link to="/" className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center">
                            Back to Home
                        </Link>
                    </div>
                    <div className='mt-5'>
                        <Link to="/learn" className="text-[#fe965e] hover:underline">
                            Explore Learning Materials
                        </Link>
                    </div>
                </div>
            </div>
            <div className='md:flex hidden w-[50%] justify-center h-[95vh]'>
                <div className='w-[60%] h-[90%] rounded-b-full bg-[#f9d9c6] flex items-center justify-center'>
                    <svg className="w-1/2 h-1/2 text-[#fe965e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </main>
    )
}

export default NotFoundPage
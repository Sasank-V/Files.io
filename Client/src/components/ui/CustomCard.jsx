import IMG from '@/assets/img.jpg'
import { Link } from 'react-router-dom'

const CustomCard = () => {
    return (
        <div className='w-full h-full flex justify-center'>
            <Link to="/subject" className="h-[300px] w-[300px] rounded-3xl overflow-hidden shadow-xl cursor-pointer active:size-[305px] hover:opacity-85 transition-all duration-150">
                <div className='h-3/4'>
                    <img src={IMG} alt="" className='w-full h-full bg-gray-50 border-0' />
                </div>
                <div className='h-1/4 p-2 text-center bg-[#fe965e] text-white'>
                    <div className='text-2xl font-semibold'>Title</div>
                    <div>BECE202L</div>
                </div>
            </Link>
        </div>
    )
}
export default CustomCard
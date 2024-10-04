import { useRef, useEffect, useState } from 'react'
import IMG from '@/assets/img.jpg'
import useAuth from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'

const CustomCard = ({ subjectData }) => {
    const { auth } = useAuth();
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);
    const overlayRef = useRef(null);
    const arrowRef = useRef(null);

    const [onCard,setOnCard] = useState(false);

    const queryParams = new URLSearchParams({
        id: subjectData.id,
    }).toString();

    

    useEffect(() => {
        const card = cardRef.current;
        const image = imageRef.current;
        const content = contentRef.current;
        const overlay = overlayRef.current;
        const arrow = arrowRef.current;

        gsap.set(overlay, { scaleY: 0, transformOrigin: 'bottom' });
        gsap.set(arrow, { x: -20, opacity: 0 });

        const enterAnimation = gsap.timeline({ paused: true });
        enterAnimation
            .to(image, { scale: 1.1, duration: 0.5, ease: "power2.out" })
            .to(overlay, { scaleY: 1, duration: 0.5, ease: "power2.out" }, 0)
            .to(content, { y: -10, duration: 0.5, ease: "power2.out" }, 0)
            .to(arrow, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.2);

        const leaveAnimation = gsap.timeline({ paused: true });
        leaveAnimation
            .to(image, { scale: 1, duration: 0.5, ease: "power2.in" })
            .to(overlay, { scaleY: 0, duration: 0.5, ease: "power2.in" }, 0)
            .to(content, { y: 0, duration: 0.5, ease: "power2.in" }, 0)
            .to(arrow, { x: -20, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);

        const handleEnter = () => enterAnimation.play();
        const handleLeave = () => leaveAnimation.play();

        card.addEventListener('mouseenter', handleEnter);
        card.addEventListener('mouseleave', handleLeave);
        setOnCard(false);

        return () => {
            card.removeEventListener('mouseenter', handleEnter);
            card.removeEventListener('mouseleave', handleLeave);
        };
    }, [onCard]);

    return (
        <div className='w-full h-full flex justify-center'>
            <Link
                id='card'
                ref={cardRef}
                to={auth?.isAdmin ? `/upload/0?id=${queryParams}` : `/subject/0?${queryParams}`}
                className="relative h-[350px] w-[300px] rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-white group"
                onPointerEnter={()=>setOnCard(true)}
                to={`/subject/0?${queryParams}`}
                className="h-[300px] w-[300px] rounded-3xl overflow-hidden shadow-xl cursor-pointer active:size-[305px] hover:opacity-85 transition-all duration-150"
            >
                <div className='h-full overflow-hidden'>
                    <img 
                        ref={imageRef}
                        src={IMG} 
                        alt={subjectData.name} 
                        className='w-full h-full object-cover transition-transform duration-300 brightness-75' 
                    />
                    <div></div>
                </div>
                <div 
                    ref={overlayRef}
                    className='absolute inset-0 bg-gradient-to-t from-[#000000] to-transparent opacity-90'
                ></div>
                <div 
                    ref={contentRef}
                    className='absolute bottom-0 left-0 right-0 p-6 text-white z-20 transition-transform duration-300'
                >
                    <h3 className='text-2xl font-bold mb-2'>
                        {subjectData.name}
                    </h3>
                    <p className='text-sm mb-4'>
                        {subjectData.code}
                    </p>
                    <div className='flex items-center'>
                        <span className='text-sm font-semibold mr-2'>Explore</span>
                        <ArrowRight ref={arrowRef} size={16} />
                    </div>
                </div>
                <div className='absolute top-4 right-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full px-3 py-1 text-xs font-semibold text-white z-20'>
                    {auth?.isAdmin ? 'Admin' : 'Student'}
                </div>
            </Link>
        </div>
    )
}

export default CustomCard
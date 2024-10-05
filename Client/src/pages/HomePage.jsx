import { Link } from 'react-router-dom'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const HomePage = () => {
    const svgRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from("#hero-content", {
            opacity: 0,
            duration: 0.75,
            delay: 0.35,
        });
        tl.from("#sub", {
            opacity: 0,
            y: 50,
            stagger: 0.5,
            ease: "power2.inOut",
        });

        // SVG animations
        const svg = svgRef.current;
        if (svg) {
            gsap.set(svg, { scale: 0, transformOrigin: "center center" });
            gsap.to(svg, {
                scale: 1,
                duration: 1,
                ease: "elastic.out(1, 0.5)",
                delay: 0.5
            });

            // Animate individual paths
            gsap.from("#book-cover", {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 0.75,
                delay: 1
            });
            gsap.from("#book-pages", {
                scaleY: 0,
                transformOrigin: "bottom center",
                duration: 0.75,
                delay: 1.25
            });
            gsap.from("#pencil", {
                y: -50,
                opacity: 0,
                duration: 0.5,
                delay: 1.5
            });

            // Continuous animations
            gsap.to("#pencil", {
                rotation: -10,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    }, []);
    return (
        <main className='flex w-full h-full overflow-y-scroll'>
            <div className="md:w-[50%] w-full p-10">
                <div className="w-full h-full flex flex-col p-10 justify-center items-center">
                    <div id="hero-content" className="md:text-[60px] text-[30px] font-semibold justify-start">
                        Empowering Learning, One File at a Time
                    </div>
                    <div className="text-[60px] font-semibold line-clamp-2 translate-y-[-20px]"></div>
                    <div>
                        <div id="sub" className='mt-10'>Seamless resource sharing and doubt solving for students and teachers.</div>
                        <div id="sub" className='mt-3'>Your gateway to a smarter, more collaborative learning experience</div>
                    </div>
                    <div className='flex justify-start mt-[50px] w-full'>
                        <Link id="sub" to="/learn" variant="outline" className="w-[200px] bg-[#fe965e] rounded-full p-3 text-lg text-white text-center">
                            Learn
                        </Link>
                    </div>
                </div>
            </div>
            <div id="show" className='md:flex hidden w-[50%] justify-center h-[95vh]'>
                <div className='w-[60%] h-[90%] rounded-b-full bg-[#f9d9c6] flex items-center justify-center'>
                    <svg
                        ref={svgRef}
                        className="w-2/3 h-2/3"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect id="book-cover" x="20" y="40" width="140" height="120" rx="5" fill="#fe965e" />
                        <path id="book-pages" d="M30 50 H150 V150 H30 C25 150 20 145 20 140 V60 C20 55 25 50 30 50 Z" fill="white" />
                        <rect id="pencil" x="70" y="20" width="10" height="140" rx="5" fill="#333" />
                        <path d="M70 20 L75 10 L80 20 Z" fill="#ffcc00" />
                    </svg>
                </div>
            </div>
        </main>
    )
}

export default HomePage
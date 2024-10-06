import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import gsap from 'gsap'

const LoadingComponent = ({text}) => {
    const containerRef = useRef(null)
    const dotsRef = useRef([])
    const textRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const text = textRef.current
        const dots = dotsRef.current

        // Create and animate dots
        const colors = ['#fe965e', '#333333', '#666666', '#ffffff']
        const gridSize = 5
        const dotSize = 10
        const spacing = 20

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const dot = document.createElement('div')
                dot.style.position = 'absolute'
                dot.style.width = `${dotSize}px`
                dot.style.height = `${dotSize}px`
                dot.style.borderRadius = '50%'
                dot.style.backgroundColor = colors[(i + j) % colors.length]
                dot.style.left = `${j * spacing}px`
                dot.style.top = `${i * spacing}px`
                container.appendChild(dot)
                dots.push(dot)

                gsap.to(dot, {
                    scale: 2,
                    duration: 0.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: (i + j) * 0.05
                })
            }
        }

        // Animate text
        gsap.to(text, {
            opacity: 0.5,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        })

        return () => {
            dots.forEach(dot => gsap.killTweensOf(dot))
            gsap.killTweensOf(text)
        }
    }, [])

    return (
        <Card className="w-full h-[100vh] bg-gradient-to-br from-[#FFF5EB] to-[#FFE4CA] relative overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center h-full">
                <div ref={containerRef} className="relative w-[100px] h-[100px]">
                    {/* Dots will be appended here */}
                </div>
                <p ref={textRef} className="mt-8 text-2xl font-bold text-[#333333]">
                    {text}...
                </p>
            </CardContent>
        </Card>
    )
}

export default LoadingComponent
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedLogoProps {
    className?: string;
}

export default function AnimatedLogo({ className }: AnimatedLogoProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    // 3D Tilt Effect variables
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Map mouse position to degree rotations (smoother, more delicate tilt)
    const rotateX = useTransform(y, [-60, 60], [10, -10]);
    const rotateY = useTransform(x, [-60, 60], [-10, 10]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left - width / 2;
        const mouseY = event.clientY - rect.top - height / 2;
        x.set(mouseX);
        y.set(mouseY);
    }

    function handleMouseLeave() {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    }

    // Elegant sparkles position
    const sparkles = [
        { top: "8%", left: "12%", delay: 0 },
        { top: "12%", right: "10%", delay: 0.3 },
        { top: "55%", left: "4%", delay: 0.6 },
        { bottom: "8%", right: "12%", delay: 0.2 },
        { bottom: "12%", left: "15%", delay: 0.5 },
    ];

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            
            {/* Elegant luxury sparkles floating on hover */}
            {isHovered && sparkles.map((sparkle, idx) => (
                <motion.div
                    key={idx}
                    className="absolute text-brand-rose z-20 pointer-events-none"
                    style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        right: sparkle.right,
                        bottom: sparkle.bottom,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                        scale: [0, 1, 0], 
                        opacity: [0, 0.9, 0],
                        y: [0, -12, 0],
                        rotate: [0, 120] 
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: sparkle.delay,
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-4 h-4 fill-brand-rose text-brand-gold" />
                </motion.div>
            ))}

            {/* Glowing Backdrop with brand-pink and mint */}
            <motion.div 
                className="absolute w-52 h-52 bg-gradient-to-tr from-brand-pink/50 via-brand-cream/30 to-brand-mint/50 rounded-full filter blur-3xl -z-10"
                animate={{
                    scale: isHovered ? 1.15 : 1,
                    opacity: isHovered ? 0.9 : 0.7,
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            {/* Main Logo Container with 3D Tilt and Float */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                }}
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative cursor-pointer select-none"
            >
                {/* Thin, glowing luxury outer border */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-rose via-brand-gold to-brand-teal rounded-full p-[2px] shadow-lg shadow-brand-pink/30 -z-10" />

                <div 
                    style={{ transform: "translateZ(30px)" }}
                    className="p-6 flex flex-col items-center justify-center w-52 h-52 md:w-60 md:h-60 rounded-full bg-white/95 backdrop-blur-md overflow-hidden relative"
                >
                    {/* Radial gold-to-white sheen */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,234,193,0.15),transparent_70%)] pointer-events-none" />
                    
                    {/* The Logo Image */}
                    <motion.img
                        src="/FOTOS/2.png"
                        alt="Odonto Sonrisa Logo"
                        className="w-32 h-32 md:w-36 md:h-36 object-contain"
                        onError={(e) => {
                            // If the image is not loaded yet, hide it and we show a gorgeous SVG teeth icon
                            e.currentTarget.style.display = "none";
                            const fallback = document.getElementById("logo-fallback");
                            if (fallback) fallback.style.display = "flex";
                        }}
                        animate={{
                            scale: isHovered ? 1.04 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* High-fidelity Fallback SVG tooth logo in case image hasn't been copied yet */}
                    <div
                        id="logo-fallback"
                        style={{ display: "none" }}
                        className="flex-col items-center justify-center text-brand-teal font-sans"
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            className="w-20 h-20 stroke-brand-gold fill-brand-pink/20 stroke-[1.5]"
                            animate={{
                                rotate: isHovered ? [0, -2, 2, 0] : 0,
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <path 
                                d="M20,40 C20,25 35,20 50,30 C65,20 80,25 80,40 C80,55 70,75 65,80 C60,85 53,75 50,75 C47,75 40,85 35,80 C30,75 20,55 20,40 Z"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            <circle cx="40" cy="45" r="2.5" fill="#2c2523" />
                            <circle cx="60" cy="45" r="2.5" fill="#2c2523" />
                            <path d="M44,53 Q50,58 56,53" fill="none" stroke="#2c2523" strokeWidth="2" strokeLinecap="round" />
                        </motion.svg>
                        <span className="font-serif text-lg font-semibold text-brand-teal mt-1">
                            Odonto Sonrisa
                        </span>
                    </div>

                    {/* Shinning overlay highlight */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        style={{ left: "-100%" }}
                        animate={{
                            left: isHovered ? "200%" : "-100%"
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
}

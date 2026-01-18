import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Background = ({ variant = 'default' }) => {
    // Variants: 'default' (Auth), 'supplier' (Violet/Primary), 'employee' (Emerald/Secondary)

    const colors = {
        default: {
            blob1: 'bg-indigo-500/20',
            blob2: 'bg-violet-500/20',
            blob3: 'bg-slate-500/10',
            particle: 'rgba(139, 92, 246, 0.3)', // violet
        },
        supplier: {
            blob1: 'bg-violet-600/30',
            blob2: 'bg-fuchsia-600/20',
            blob3: 'bg-indigo-900/40',
            particle: 'rgba(192, 132, 252, 0.4)', // violet-400
        },
        employee: {
            blob1: 'bg-emerald-500/20',
            blob2: 'bg-teal-500/20',
            blob3: 'bg-cyan-500/10',
            particle: 'rgba(52, 211, 153, 0.4)', // emerald-400
        }
    };

    const currentTheme = colors[variant] || colors.default;

    // Generate random particles
    const particles = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 5,
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Animated Gradient Overlay */}
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${currentTheme.particle}, transparent 70%)`
                }}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: currentTheme.particle,
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Main Blobs with Enhanced Effects */}
            <motion.div
                className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] ${currentTheme.blob1}`}
                style={{
                    background: `radial-gradient(circle, currentColor, transparent 70%)`,
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className={`absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[80px] ${currentTheme.blob2}`}
                style={{
                    background: `radial-gradient(circle, currentColor, transparent 70%)`,
                }}
                animate={{
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />
            <motion.div
                className={`absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] ${currentTheme.blob3}`}
                style={{
                    background: `radial-gradient(circle, currentColor, transparent 70%)`,
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
            />

            {/* Mesh Gradient Effect */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, ${currentTheme.particle} 1px, transparent 1px),
                        linear-gradient(to bottom, ${currentTheme.particle} 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
                }}
            />
        </div>
    );
};

export default Background;

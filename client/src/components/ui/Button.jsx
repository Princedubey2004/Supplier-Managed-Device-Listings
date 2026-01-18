import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    ...props
}) => {
    const [ripples, setRipples] = useState([]);

    const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

    const variants = {
        primary: 'btn-primary',
        secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg shadow-secondary-500/30 rounded-lg',
        outline: 'btn-outline',
        ghost: 'hover:bg-white/10 text-slate-200 hover:text-white rounded-lg',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-lg',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const createRipple = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
    };

    const handleClick = (event) => {
        createRipple(event);
        if (props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            {...props}
            onClick={handleClick}
        >
            {/* Ripple Effects */}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            ))}

            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </motion.button>
    );
};

export default Button;

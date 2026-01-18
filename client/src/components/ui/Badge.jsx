import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    animated = false,
    className = '',
}) => {
    const variants = {
        default: 'bg-slate-700 text-slate-200',
        primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
        success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

    const BadgeComponent = animated ? motion.span : 'span';

    const motionProps = animated
        ? {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0, opacity: 0 },
            transition: { type: 'spring', stiffness: 500, damping: 30 },
        }
        : {};

    return (
        <BadgeComponent
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...motionProps}
        >
            {children}
        </BadgeComponent>
    );
};

export default Badge;

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            className={`glass-card p-6 ${className}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
                y: -4,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                borderColor: "rgba(99, 102, 241, 0.3)" // Indigo hint
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;

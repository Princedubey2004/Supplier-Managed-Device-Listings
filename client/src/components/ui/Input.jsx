import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = ({ label, error, className = '', id, type = 'text', value, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Check if input has value (either from controlled value prop or input element)
    const hasValue = value !== undefined ? value !== '' : (inputRef.current?.value || '') !== '';

    return (
        <div className="w-full relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    type={type}
                    value={value}
                    className={`input-field peer ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className} ${label ? 'pt-6 pb-2' : ''}`}
                    placeholder={!label ? props.placeholder : ' '}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {label && (
                    <motion.label
                        htmlFor={id}
                        className={`absolute left-4 transition-all pointer-events-none ${error ? 'text-red-400' : 'text-slate-400'
                            }`}
                        animate={{
                            top: isFocused || hasValue ? '0.5rem' : '50%',
                            fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
                            y: isFocused || hasValue ? 0 : '-50%',
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {label}
                    </motion.label>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        className="mt-1 text-sm text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span>⚠</span> {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Input;

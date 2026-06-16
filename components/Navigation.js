'use client'

import {useEffect, useState} from "react";

const pages  = ['/', '/stats', '/health'];

export default function Navigation() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'ArrowLeft') {
                setIndex(i => (i - 1 + pages.length) % pages.length);
            }
            if (e.code === 'ArrowRight' || e.code === 'Tab') {
                setIndex(i => (i + 1) % pages.length);
            }
            if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
                setIndex(e.code[5] - 1);
            }

            window.location.href = pages[index];
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pages.length]);
}
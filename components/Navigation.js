'use client'

import {useEffect} from "react";

const pages  = [['/', '/stats', '/health']]

export default function Navigation(page) {
    const [index, setIndex] = React.useState(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'ArrowLeft') {
                setIndex(i => (i - 1 + [pages].length) % [pages].length);
            }
            if (e.code === 'ArrowRight' || e.code === 'Tab') {
                setIndex(i => (i + 1) % pages.length);
            }
            if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {

            }

        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page]);
}
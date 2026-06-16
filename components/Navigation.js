'use client'

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";

const PAGES  = ['/', '/stats', '/health'];

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;

            const currentIdx = PAGES.indexOf(pathname);
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'ArrowLeft') {
                const newIdx = (currentIdx - 1 + PAGES.length) % PAGES.length;
            }
            if (e.code === 'ArrowRight' || e.code === 'Tab') {
                const newIdx = (currentIdx + 1) % PAGES.length;
            }
            if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
                const newIdx = (e.code[5] - 1);
            }

            router.push[PAGES[newIndex]];
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pages.length]);
}
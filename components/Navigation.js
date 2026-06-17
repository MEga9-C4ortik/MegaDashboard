'use client'

import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";

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
                e.preventDefault();
                const newIdx = (currentIdx - 1 + PAGES.length) % PAGES.length;
                router.push(PAGES[newIdx]);
            }
            if (e.code === 'ArrowRight' || e.code === 'Tab') {
                e.preventDefault();
                const newIdx = (currentIdx + 1) % PAGES.length;
                router.push(PAGES[newIdx]);
            }
            if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
                e.preventDefault();
                const newIdx = (e.code[5] - 1);
                router.push(PAGES[newIdx]);
            }


        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pathname, router]);

    return null;
}
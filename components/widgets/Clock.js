'use client';
import { useState, useEffect } from 'react';

export default function Clock() {
    const [now, setNow] = useState(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!now) return null;

    return (
        <div className="text-xs text-neutral-100 tracking-widest uppercase leading-relaxed">
            <div>
                {now.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).replaceAll(",", " ")}
            </div>
            <div className="text-lg font-medium mt-0.5">
                {now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                })}
            </div>
        </div>
    );
}
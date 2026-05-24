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
        <div className="text-sm text-neutral-100 tracking-widest uppercase">
            <div>
                {now.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).replaceAll(",", " ")}
            </div>
            <div>
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
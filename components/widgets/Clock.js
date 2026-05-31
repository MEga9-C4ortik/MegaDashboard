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

    const week = getWeekNumber(now);
    const dayOfYear = getDayOfYear(now);
    const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365;
    const yearProgress = Math.round((dayOfYear / totalDays) * 100);

    return (
        <div>
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

            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-neutral-600 tracking-widest uppercase shrink-0">
                    W{week}
                </span>
                <div className="flex-1 h-px bg-neutral-800 relative overflow-hidden rounded-full">
                    <div
                        className="absolute left-0 top-0 h-full bg-neutral-600 rounded-full transition-all"
                        style={{ width: `${yearProgress}%` }}
                    />
                </div>
                <span className="text-xs text-neutral-600 tabular-nums shrink-0">
                    {yearProgress}%
                </span>
            </div>
        </div>
    );
}
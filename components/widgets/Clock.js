'use client';
import { useState, useEffect } from 'react';

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / 86400000);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

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
        <div className="flex flex-col justify-center gap-0.5 w-full">
            <div className="flex items-baseline p justify-between">
                <span className="text-xs text-neutral-100 font-medium tracking-widest uppercase">
                    {now.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }).replaceAll(",", " ")}
                </span>
                <span className="text-xs text-neutral-300 tracking-widest uppercase shrink-0 ml-2">
                    W{week}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-neutral-100 shrink-0 tabular-nums mr-3">
                    {now.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    })}
                </span>
                <div className="flex-1 h-px bg-neutral-600 relative overflow-hidden rounded-full">
                    <div
                        className="absolute left-0 top-0 h-full bg-neutral-200 rounded-full"
                        style={{ width: `${yearProgress}%` }}
                    />
                </div>
                <span className="text-xs text-neutral-100 tabular-nums shrink-0">
                    {yearProgress}%
                </span>
            </div>

        </div>
    );
}
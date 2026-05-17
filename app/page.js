'use client'

import {useState, useEffect} from 'react';
import DailyFocus from '../components/widgets/DailyFocus';

export default function Home() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <main className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col gap-4">
            <div className="text-sm text-neutral-100 tracking-widest uppercase">
                <div>
                    {now.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }).replaceAll(",", " ")}{" "}
                </div>
                <div>{now.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                        })
                    }
                </div>
            </div>

            <DailyFocus />
        </main>
    )
}
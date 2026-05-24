'use client'

import {useState, useEffect} from 'react';
import DailyFocus from '../components/widgets/DailyFocus';
import Habits from '../components/widgets/HabitTracker';
import Clock from '../components/widgets/Clock';

export default function Home() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <main className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col gap-4">
            <Clock/>
            <DailyFocus />
            <Habits />
        </main>
    )
}
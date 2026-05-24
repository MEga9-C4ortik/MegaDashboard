'use client'

import {useState, useEffect} from 'react';
import DailyFocus from '../components/widgets/DailyFocus';
import Habits from '../components/widgets/HabitTracker';
import Clock from '../components/widgets/Clock';

export default function Home() {
    return (
        <main className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col gap-4">
            <Clock/>
            <DailyFocus />
            <Habits />
        </main>
    )
}
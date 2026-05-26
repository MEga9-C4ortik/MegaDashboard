'use client'

import DailyFocus from '../components/widgets/DailyFocus';
import Habits from '../components/widgets/HabitTracker';
import Clock from '../components/widgets/Clock';
import Weather from '../components/widgets/Weather';

export default function Home() {
    return (
        <main className="h-dvh bg-neutral-900 text-white p-3 overflow-hidden grid gap-3"
              style={{
                  gridTemplateColumns: '240px 1fr 240px',
                  gridTemplateRows: '72px 1fr 160px',
              }}
        >
            {/* РЯД 1: Clock | DailyFocus | Weather */}
            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center">
                <Clock />
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center">
                <DailyFocus />
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center">
                <Weather />
            </div>

            {/* РЯД 2: Habits | Todo(placeholder) | Calendar(placeholder) */}
            <div className="bg-neutral-800 rounded-2xl p-4 overflow-y-auto min-h-0">
                <Habits />
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center justify-center">
                <span className="text-neutral-600">Todo — coming soon</span>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center justify-center">
                <span className="text-neutral-600">Calendar — coming soon</span>
            </div>

            {/* РЯД 3: Health | Notes | Currency */}
            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center justify-center">
                <span className="text-neutral-600">Health — coming soon</span>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center justify-center">
                <span className="text-neutral-600">Notes — coming soon</span>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center justify-center">
                <span className="text-neutral-600">Currency — coming soon</span>
            </div>
        </main>
    )
}
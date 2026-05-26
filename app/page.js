'use client'

import DailyFocus from '../components/widgets/DailyFocus';
import Habits from '../components/widgets/HabitTracker';
import Clock from '../components/widgets/Clock';
import Weather from '../components/widgets/Weather';

export default function Home() {
    return (
        <main className="h-screen bg-neutral-900 text-white p-4 overflow-hidden grid gap-3"
              style={{
                  gridTemplateColumns: '22% 1fr 22%',
                  gridTemplateRows: '12dvh 1fr 28dvh',
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
            <div className="bg-neutral-800 rounded-2xl p-4 overflow-y-auto">
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
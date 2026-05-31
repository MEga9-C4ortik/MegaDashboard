'use client'

import DailyFocus from '../components/widgets/DailyFocus';
import Habits from '../components/widgets/HabitTracker';
import Clock from '../components/widgets/Clock';
import Weather from '../components/widgets/Weather';
import Todo from "../components/widgets/Todo";
import Notes from "@/components/widgets/Notes";

export default function Home() {
    return (
        <main className="h-dvh bg-neutral-950 text-white p-2 overflow-hidden grid gap-2"
              style={{
                  gridTemplateColumns: '280px 1fr 300px',
                  gridTemplateRows: '81px 1fr 180px',
              }}
        >
            {/* РЯД 1 */}
            <div className="bg-neutral-900 rounded-xl px-4 py-3 flex items-center overflow-hidden border border-neutral-800/50">
                <Clock />
            </div>

            <div className="bg-neutral-900 rounded-xl px-4 py-3 flex items-center overflow-hidden border border-neutral-800/50">
                <DailyFocus />
            </div>

            <div className="bg-neutral-900 rounded-xl px-4 py-3 flex items-center overflow-hidden border border-neutral-800/50">
                <Weather />
            </div>

            {/* РЯД 2 */}
            <div className="bg-neutral-900 rounded-xl p-3 overflow-y-auto scrollbar-hide min-h-0 border border-neutral-800/50">
                <Habits />
            </div>

            <div className="bg-neutral-900 rounded-xl p-3 flex items-center justify-center min-h-0 border border-neutral-800/50">
                <Todo />
            </div>

            <div className="bg-neutral-900 rounded-xl p-3 flex items-center justify-center min-h-0 border border-neutral-800/50">
                <span className="text-neutral-700 text-sm">Calendar — coming soon</span>
            </div>

            {/* РЯД 3 */}
            <div className="bg-neutral-900 rounded-xl p-3 flex items-center justify-center border border-neutral-800/50">
                <div className="...">
                    <Notes />
                </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-3 flex items-center justify-center border border-neutral-800/50">
                <span className="text-neutral-700 text-sm">Health</span>
            </div>

            <div className="bg-neutral-900 rounded-xl p-3 flex items-center justify-center border border-neutral-800/50">
                <span className="text-neutral-700 text-sm">Currency</span>
            </div>
        </main>
    )
}
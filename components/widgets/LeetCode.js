'use client'
import {useState, useEffect} from 'react';

function timeAgo (dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days} days ago`;
}

function getColour (count) {
    if (count === 0) return 'bg-neutral-800';
    if (count <= 2) return 'bg-orange-900';
    if (count <= 5) return 'bg-orange-800';
    if (count <= 9) return 'bg-orange-600';
    return 'bg-orange-400';
}

export default function LeetCode() {
    const [data, setData] = useState(null);
    const [hoverDay, setHoverDay] = useState(null);

    useEffect(() => {
        fetch('/api/leetcode')
            .then(res => res.json())
            .then(setData)
    }, []);

    if (!data) return (
        <div className="animate-pulse flex flex-col gap-2 w-full h-full">
            <div className="w-24 h-4 bg-neutral-800 rounded"></div>
            <div className="flex-1 bg-neutral-800 rounded"></div>
            <div className="w-40 h-3 bg-neutral-800 rounded"></div>
            <div className="w-32 h-3 bg-neutral-800 rounded"></div>
        </div>
    );

    return (
        <div className="flex h-full gap-4 items-center">
            {/* Streak and Header */}
            <div className="flex flex-col shrink-0">
                <a className="font-bold text-xl leading-tight" href="https://leetcode.com/u/mega_9/">
                    LEETCODE
                </a>
                <span className="">
                    {data.streak} streak {data.totalActiveDays} days active
                </span>
            </div>

            {/* Heatmap */}
            <div className="flex gap-0.5 shrink-0 overflow-x-auto scrollbar-hide">
                {data.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                        {week.map((day, di) => (
                            <div
                                key={day.date}
                                className={`w-2.5 h-2.5 rounded-sm cursor-pointer
                                    transition-opacity hover:opacity-70
                                    ${getColour(day.count)}`}
                                onClick={() => setHoverDay(
                                    hoverDay?.date === day.date ? null : day
                                )}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="flex flex-col shrink-0 gap-1">
                <div className="flex flex-col shrink-0">
                    <span className="text-green-400">
                        {data.stats.easy.solved}/{data.stats.easy.total}
                    </span>
                    <span className="text-yellow-400">
                        {data.stats.medium.solved}/{data.stats.medium.total}
                    </span>
                    <span className="text-red-400">
                        {data.stats.hard.solved}/{data.stats.hard.total}
                    </span>
                    <span className="text-neutral-200">
                        {data.stats.easy.solved + data.stats.medium.solved + data.stats.hard.solved}/{data.stats.easy.total + data.stats.medium.total + data.stats.hard.total}
                    </span>
                </div>
            </div>

            {/* recent solved problems */}
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                {data.recent.map(s => (
                    <a key={s.id} className="flex items-center gap-1" href={`https://leetcode.com/problems/${s.slug}`} >
                        {s.title} {timeAgo(s.date)}
                    </a>
                ))}
            </div>
        </div>
    );
}
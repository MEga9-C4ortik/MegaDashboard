'use client'
import { useState, useEffect } from 'react';

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

function getColour(count) {
    if (count === 0) return 'bg-neutral-800';
    if (count <= 2) return 'bg-orange-900';
    if (count <= 5) return 'bg-orange-700';
    if (count <= 9) return 'bg-orange-500';
    return 'bg-orange-400';
}

export default function LeetCode() {
    const [data, setData] = useState(null);
    const [hoverDay, setHoverDay] = useState(null);

    useEffect(() => {
        fetch('/api/leetcode')
            .then(res => res.json())
            .then(setData);
    }, []);

    if (!data) return (
        <div className="animate-pulse flex gap-4 w-full h-full items-center">
            <div className="flex flex-col gap-2 shrink-0">
                <div className="h-3 w-20 bg-neutral-800 rounded" />
                <div className="h-3 w-24 bg-neutral-800 rounded" />
                <div className="h-3 w-16 bg-neutral-800 rounded" />
            </div>
            <div className="flex gap-0.5 shrink-0">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                        {[...Array(7)].map((_, j) => (
                            <div key={j} className="w-1.5 h-1.5 bg-neutral-800 rounded-sm" />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-2.5 w-16 bg-neutral-800 rounded" />
                ))}
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-2.5 bg-neutral-800 rounded" />
                ))}
            </div>
        </div>
    );

    const totalSolved = data.stats.easy.solved + data.stats.medium.solved + data.stats.hard.solved;

    return (
        <div className="flex h-full gap-0 items-stretch">

            {/* Header */}
            <div className="flex flex-col justify-center gap-1.5 pr-4 shrink-0">
                <a
                    href="https://leetcode.com/u/mega_9/"
                    className="text-sm text-neutral-200 uppercase tracking-widest font-medium hover:text-white transition-colors"
                >
                    LeetCode
                </a>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-neutral-300">
                        <span className={data.streak > 0 ? 'text-orange-400 font-medium' : 'text-neutral-400'}>
                            {data.streak}
                        </span> {data.streak === 1 ? 'day' : 'days'} streak
                    </span>
                    <span className="text-sm text-neutral-300">
                        <span className="text-neutral-300 font-medium">{totalSolved}</span> solved
                    </span>
                    <span className="text-sm text-neutral-300">
                        <span className="text-neutral-300 font-medium">{data.totalActiveDays}</span> active days
                    </span>
                </div>
            </div>

            <div className="w-px bg-neutral-800 shrink-0 mx-4" />

            {/* Heatmap */}
            <div className="flex flex-col gap-4 justify-center">
                {/* Hover */}
                <span className="text-xs text-neutral-600 h-4">
                    {hoverDay
                        ? <><span className="text-neutral-300">{hoverDay.count}</span> · {hoverDay.date}</>
                        : null
                    }
                </span>
                <div className="flex gap-0.5 shrink-0 items-center relative">
                    {data.weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-0.5">
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    title={`${day.date}: ${day.count}`}
                                    className={`w-2.5 h-2.5 rounded-sm cursor-pointer transition-opacity hover:opacity-60 ${getColour(day.count)}`}
                                    onClick={() => setHoverDay(
                                        hoverDay?.date === day.date ? null : day
                                    )}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-px bg-neutral-800 shrink-0 mx-4" />

            {/* Stats */}
            <div className="flex flex-col justify-center gap-1 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 w-10">Easy</span>
                    <span className="text-sm text-green-400 font-medium tabular-nums">{data.stats.easy.solved}</span>
                    <span className="text-sm text-neutral-700 tabular-nums">/{data.stats.easy.total}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 w-10">Med</span>
                    <span className="text-sm text-yellow-400 font-medium tabular-nums">{data.stats.medium.solved}</span>
                    <span className="text-sm text-neutral-700 tabular-nums">/{data.stats.medium.total}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 w-10">Hard</span>
                    <span className="text-sm text-red-400 font-medium tabular-nums">{data.stats.hard.solved}</span>
                    <span className="text-sm text-neutral-700 tabular-nums">/{data.stats.hard.total}</span>
                </div>
                <div className="flex items-center gap-2 border-t border-neutral-800 pt-1 mt-0.5">
                    <span className="text-sm text-neutral-600 w-10">All</span>
                    <span className="text-sm text-neutral-300 font-medium tabular-nums">{totalSolved}</span>
                    <span className="text-sm text-neutral-700 tabular-nums">
                        /{data.stats.easy.total + data.stats.medium.total + data.stats.hard.total}
                    </span>
                </div>
            </div>

            <div className="w-px bg-neutral-800 shrink-0 mx-4" />

            {/* Recent problems */}
            <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
                <span className="text-sm text-neutral-200 uppercase tracking-widest mb-1">Recent</span>
                {data.recent.map(s => (
                    <a
                        key={s.id}
                        href={`https://leetcode.com/problems/${s.slug}`}
                        className="flex items-center gap-2 hover:text-white transition-colors group"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="text-sm text-neutral-400 truncate group-hover:text-neutral-200 transition-colors flex-1 min-w-0">
                            {s.title}
                        </span>
                        <span className="text-sm text-neutral-700 shrink-0 tabular-nums">
                            {timeAgo(s.date)}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}
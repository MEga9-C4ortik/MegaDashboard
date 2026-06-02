'use client'
import {useState, useEffect} from "react";

function timeAgo (dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}days ago`;
}

function getColour (count) {
    if (count === 0) return 'bg-neutral-800';
    if (count <= 2) return 'bg-emerald-950';
    if (count <= 5) return 'bg-emerald-800';
    if (count <= 9) return 'bg-emerald-600';
    return 'bg-emerald-400';
}

export default function GitHub () {
    const [data, setData] = useState(null);
    const [hoverDay, setHoverDay] = useState(null);

    useEffect(() => {
        fetch('/api/github')
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

    const weeks = data.weeks.slice(-20);

    return (
        <div className="flex flex-col h-full w-full gap-0.5">
            <div className="flex items-center justify-between gap-5 shrink-0">
                <h4 className="text-sm text-neutral-200 uppercase tracking-wide font-medium">
                    GitHub
                </h4>
                {hoverDay ? (
                    <span className="text-xs text-neutral-500">
                        <span className="text-neutral-200">{hoverDay.contributionCount}</span> commits · {hoverDay.date}
                    </span>
                ) : (
                    <span className="text-xs text-neutral-300 gap-3">
                        <span className="text-neutral-200">
                            {data.streak}d
                        </span> streak {' '}
                        <span className="text-neutral-200">
                            {' | '}{data.totalContributions}
                        </span> this year
                    </span>
                )}
            </div>

            <div className="flex gap-0.5 shrink-0 overflow-x-auto scrollbar-hide">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                        {week.contributionDays.map((day, di) => (
                            <div
                                key={day.date}
                                className={`w-2.5 h-2.5 rounded-sm cursor-pointer
                                    transition-opacity hover:opacity-70
                                    ${getColour(day.contributionCount)}`}
                                onClick={() => setHoverDay(
                                    hoverDay?.date === day.date ? null : day
                                )}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {data.lastCommit && (
                <div className="flex items-center gap-1 text-xs text-neutral-300 shrink-0">
                    <span className="truncate text-neutral-300">{data.lastCommit.message}</span>
                    <span className="shrink-0 text-neutral-500">· {timeAgo(data.lastCommit.date)}</span>
                    {data.lastCommit.repo}
                </div>
            )}
        </div>
    );
}
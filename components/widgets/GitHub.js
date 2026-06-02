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
        <div className="flex flex-col h-full w-full gap-2">
            <div>
                <h4 className="text-sm text-neutral-200 uppercase tracking-wide font-medium">
                    GitHub
                </h4>
                <span className="text-xs text-neutral-600">@{data.username}</span>
            </div>

            <div className="flex gap-0.5 shrink-0">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-0.5">
                        {week.contributionDays.map((day, di) => (
                            <div
                                key={day.date}
                                className={`w-3 h-3 rounded-sm cursor-pointer
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

            <div className="text-xs text-neutral-500 shrink-0 h-4">
                {hoverDay ? (
                    <span>
                        <span className="text-neutral-200">
                            {hoverDay.contributionCount}
                        </span>
                        {' '}commits . {hoverDay.date}
                    </span>
                ) : (
                    <span>
                        <span className="text-neutral-200">{data.streak}d</span>
                        streak {' . '}
                        <span className="text-neutral-200">{data.totalContributions}</span>
                        this year
                    </span>
                )
                }
            </div>

            {data.lastCommit && (
                <div className="flex flex-col gap-0.5 min-w-0 shrink-0 mt-auto">
                    <span className="text-xs text-neutral-600 truncate">
                        {data.lastCommit.repo} . {timeAgo(data.lastCommit.date)}
                    </span>
                    <span className="text-xs text-neutral-400 truncate">
                        {data.lastCommit.message}
                    </span>
                </div>
            )}
        </div>
    );
}
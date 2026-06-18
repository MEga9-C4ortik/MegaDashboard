'use client'
import { useEffect, useState } from "react";

const getDaysLeft = (deadline) =>
    Math.ceil((new Date(deadline) - new Date()) / 86400000);

const getStripColor = (days) => {
    if (days <= 0) return 'bg-red-500';
    if (days <= 3) return 'bg-orange-500';
    if (days <= 7) return 'bg-yellow-400';
    if (days <= 14) return 'bg-green-500';
    return 'bg-neutral-700';
};

const getTextColor = (days) => {
    if (days <= 0) return 'text-red-400';
    if (days <= 3) return 'text-orange-400';
    if (days <= 7) return 'text-yellow-400';
    if (days <= 14) return 'text-green-400';
    return 'text-neutral-500';
};

const formatDays = (days) => {
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Tomorrow';
    return `${days} d`;
};

const STATUS_STYLES = {
    "In Progress": "bg-blue-500/10 text-blue-400",
    "Not started": "bg-neutral-800 text-neutral-500",
    "Done": "bg-green-500/10 text-green-500",
};

export default function Study() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/study')
            .then(res => res.json())
            .then(data => setSubjects(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="animate-pulse flex flex-col gap-1.5 w-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                    <div className="w-[3px] h-8 bg-neutral-800 rounded shrink-0" />
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-3.5 bg-neutral-800 rounded w-32" />
                        <div className="h-2.5 bg-neutral-800 rounded w-48" />
                    </div>
                    <div className="h-3 w-12 bg-neutral-800 rounded" />
                </div>
            ))}
        </div>
    );

    if (error) return <div className="text-neutral-500 text-xs">{error}</div>;

    return (
        <div className="flex flex-col h-full w-full gap-2">
            <div className="flex items-center justify-between shrink-0 pb-2 border-b border-neutral-800">
                <span className="text-sm text-neutral-200 uppercase tracking-widest font-medium">Study</span>
                <span className="text-xs text-neutral-600">{subjects.length} subjects</span>
            </div>

            <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-hide flex-1 min-h-0">
                {subjects.length === 0 && (
                    <div className="flex items-center justify-center flex-1 text-neutral-700 text-sm">
                        Нет активных предметов
                    </div>
                )}
                {subjects.map((subject) => {
                    const days = getDaysLeft(subject.deadline);
                    return (
                        <div key={subject.id}
                             className="flex items-stretch rounded-lg overflow-hidden hover:bg-neutral-800/40 transition-colors">
                            <div className={`w-[3px] shrink-0 ${getStripColor(days)}`} />
                            <div className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm text-neutral-200 truncate font-medium">
                                        {subject.name}
                                    </p>
                                    {subject.tasks && (
                                        <p className="text-xs text-neutral-500 truncate">
                                            {subject.tasks}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-xs font-medium tabular-nums ${getTextColor(days)}`}>
                                        {formatDays(days)}
                                    </span>
                                    {subject.status && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[subject.status] ?? 'bg-neutral-800 text-neutral-500'}`}>
                                            {subject.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
'use client'
import { useEffect, useState } from "react";

const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    return Math.ceil((new Date(deadline) - new Date()) / 86400000);
};

const getDotColor = (days) => {
    if (days === null) return 'bg-neutral-600';
    if (days <= 0) return 'bg-red-500';
    if (days <= 3) return 'bg-orange-500';
    if (days <= 7) return 'bg-yellow-400';
    if (days <= 14) return 'bg-green-500';
    return 'bg-neutral-600';
};

const getTextColor = (days) => {
    if (days === null) return 'text-neutral-600';
    if (days <= 0) return 'text-red-400';
    if (days <= 3) return 'text-orange-400';
    if (days <= 7) return 'text-yellow-400';
    if (days <= 14) return 'text-green-400';
    return 'text-neutral-500';
};

const formatDays = (days) => {
    if (days === null) return '—';
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Tomorrow';
    return `${days} d`;
};

const formatDate = (deadline) => {
    if (!deadline) return '';
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const STATUS_STYLES = {
    "In Progress": "bg-blue-500/10 text-blue-400",
    "Not started": "bg-neutral-800 text-neutral-600",
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
        <div className="animate-pulse flex flex-col gap-2 w-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-800 shrink-0" />
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="h-3.5 bg-neutral-800 rounded w-28" />
                        <div className="h-2.5 bg-neutral-800 rounded w-40" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="h-3 w-10 bg-neutral-800 rounded" />
                        <div className="h-2.5 w-12 bg-neutral-800 rounded" />
                    </div>
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

            <div className="flex flex-col overflow-y-auto scrollbar-hide flex-1 min-h-0">
                {subjects.length === 0 && (
                    <div className="flex items-center justify-center flex-1 text-neutral-700 text-sm">
                        No active subjects
                    </div>
                )}

                {subjects.map((subject) => {
                    const days = getDaysLeft(subject.deadline);
                    return (
                        <div
                            key={subject.id}
                            className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-neutral-800/40 transition-colors"
                        >
                            {/* Цветная точка */}
                            <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getDotColor(days)}`} />

                            {/* Название + задача + статус */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-sm text-neutral-200 font-medium truncate">
                                    {subject.name}
                                </p>
                                {subject.tasks && (
                                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                                        {subject.tasks}
                                    </p>
                                )}
                                {subject.status && STATUS_STYLES[subject.status] && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 self-start ${STATUS_STYLES[subject.status]}`}>
                                        {subject.status}
                                    </span>
                                )}
                            </div>

                            {/* Дни + дата */}
                            <div className="flex flex-col items-end shrink-0">
                                <span className={`text-xs font-medium tabular-nums ${getTextColor(days)}`}>
                                    {formatDays(days)}
                                </span>
                                {subject.deadline && (
                                    <span className="text-xs text-neutral-600 mt-0.5">
                                        {formatDate(subject.deadline)}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
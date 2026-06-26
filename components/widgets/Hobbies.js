'use client'
import { useEffect, useState } from "react";

const getDaysLeft = (deadline) => {
    if (deadline === null || deadline === undefined) {
        return null;
    }
    return Math.ceil((new Date(deadline) - new Date()) / 86400000);
};

const getStripColor = (days) => {
    if (days === null) return 'bg-neutral-700';
    if (days <= 0) return 'bg-red-500';
    if (days <= 3) return 'bg-orange-500';
    if (days <= 7) return 'bg-yellow-400';
    if (days <= 14) return 'bg-green-500';
    return 'bg-neutral-700';
};

const getTextColor = (days) => {
    if (days === null) return 'text-neutral-500';
    if (days <= 0) return 'text-red-400';
    if (days <= 3) return 'text-orange-400';
    if (days <= 7) return 'text-yellow-400';
    if (days <= 14) return 'text-green-400';
    return 'text-neutral-500';
};

const formatDays = (days) => {
    if (days === null) return '';
    if (days <= 0) return 'Overdue';
    if (days === 1) return 'Tomorrow';
    return `${days} d`;
};

export default function Hobbies() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/hobby')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="animate-pulse flex flex-col gap-1.5 w-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                    <div className="w-0.75 h-8 bg-neutral-800 rounded shrink-0" />
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
                <span className="text-sm text-neutral-200 uppercase tracking-widest font-medium">Hobbies</span>
                <span className="text-xs text-neutral-600">{projects.length} Projects </span>
            </div>

            <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-hide flex-1 min-h-0">
                {projects.length === 0 && (
                    <div className="flex items-center justify-center flex-1 text-neutral-700 text-sm">
                        No active projects
                    </div>
                )}
                {projects.map((project) => {
                    const days = getDaysLeft(project.deadline);
                    return (
                        <div key={project.id}
                             className="flex items-stretch rounded-lg overflow-hidden hover:bg-neutral-800/40 transition-colors">
                            <div className={`w-2 shrink-0 ${getStripColor(days)}`} />
                            <div className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm text-neutral-200 truncate font-medium">
                                        {project.name}
                                    </p>
                                    {project.tasks && (
                                        <p className="text-xs text-neutral-500 truncate">
                                            {project.tasks}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-xs font-medium tabular-nums ${getTextColor(days)}`}>
                                        {formatDays(days)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
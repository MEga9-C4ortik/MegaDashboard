'use client'
import { useEffect, useState, useRef } from "react";

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

export default function Hobbies() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [bullets, setBullets] = useState({});
    const inputRefs = useRef([]);

    useEffect(() => {
        fetch('/api/hobby')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleExpand = (projectId) => {
        if (expanded === projectId) {
            setExpanded(null);
        } else {
            setExpanded(projectId);
            if (bullets[projectId] === undefined) {
                fetch(`/api/hobby?pageId=${projectId}`)
                    .then(res => res.json())
                    .then(data => setBullets(prev => ({ ...prev, [projectId]: data })));
            }
        }
    };

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
                <span className="text-sm text-neutral-200 uppercase tracking-widest font-medium">Hobbies</span>
                <span className="text-xs text-neutral-600">{projects.length} projects</span>
            </div>

            <div className="flex flex-col overflow-y-auto scrollbar-hide flex-1 min-h-0">
                {projects.length === 0 && (
                    <div className="flex items-center justify-center flex-1 text-neutral-700 text-sm">
                        No active projects
                    </div>
                )}

                {projects.map((project) => {
                    const days = getDaysLeft(project.deadline);
                    const isExpanded = expanded === project.id;

                    return (
                        <div key={project.id} className="flex flex-col">
                            <div
                                className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-neutral-800/40 transition-colors cursor-pointer"
                                onClick={() => handleExpand(project.id)}
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getDotColor(days)}`} />

                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm text-neutral-200 font-medium truncate">
                                        {project.name}
                                    </p>
                                    {project.description && (
                                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                                            {project.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end shrink-0">
                                    <span className={`text-xs font-medium tabular-nums ${getTextColor(days)}`}>
                                        {formatDays(days)}
                                    </span>
                                    {project.deadline && (
                                        <span className="text-xs text-neutral-600 mt-0.5">
                                            {formatDate(project.deadline)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="flex flex-col ml-7 mb-1">
                                    {bullets[project.id]?.map((bullet, index) => (
                                        <div
                                            key={bullet.id}
                                            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-800/30 transition-colors"
                                        >
                                            <span className="text-neutral-700 shrink-0 text-xs select-none">•</span>
                                            <input
                                                ref={el => inputRefs.current[index] = el}
                                                value={bullet.text}
                                                className="bg-transparent outline-none text-xs text-neutral-400 w-full placeholder-neutral-700 focus:text-neutral-200 transition-colors"
                                                placeholder="empty task..."
                                                onChange={e => setBullets(prev => ({
                                                    ...prev,
                                                    [project.id]: prev[project.id].map((n, i) =>
                                                        i !== index ? n : { ...n, text: e.target.value }
                                                    )
                                                }))}
                                                onBlur={() => {
                                                    fetch(`/api/hobby?blockId=${bullet.id}`, {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ text: bullet.text })
                                                    });
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        fetch(`/api/hobby?pageId=${project.id}`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ text: "", pageId: project.id })
                                                        })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                const newBullet = { id: data.id, text: "" };
                                                                const newBullets = [
                                                                    ...bullets[project.id].slice(0, index + 1),
                                                                    newBullet,
                                                                    ...bullets[project.id].slice(index + 1)
                                                                ];
                                                                setBullets(prev => ({ ...prev, [project.id]: newBullets }));
                                                                setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
                                                            });
                                                    } else if (e.key === 'Backspace' && bullet.text === '') {
                                                        e.preventDefault();
                                                        setBullets(prev => ({
                                                            ...prev,
                                                            [project.id]: prev[project.id].filter((_, i) => i !== index)
                                                        }));
                                                        inputRefs.current = [];
                                                        fetch(`/api/hobby?blockId=${bullet.id}`, { method: 'DELETE' });
                                                        if (index > 0)
                                                            setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
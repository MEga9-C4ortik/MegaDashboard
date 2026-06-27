'use client'
import { useEffect, useState, useRef } from "react";

const getDaysLeft = (deadline) => {
    if (deadline === null || deadline === undefined) return null;
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
                <span className="text-xs text-neutral-600">{projects.length} Projects</span>
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
                        <div key={project.id} className="flex flex-col rounded-lg overflow-hidden">
                            <div
                                className="flex items-stretch hover:bg-neutral-800/40 transition-colors cursor-pointer"
                                onClick={() => handleExpand(project.id)}
                            >
                                <div className={`w-2 shrink-0 ${getStripColor(days)}`} />
                                <div className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0">
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <p className="text-sm text-neutral-200 truncate font-medium">
                                            {project.name}
                                        </p>
                                        {project.description && (
                                            <p className="text-xs text-neutral-500 truncate">
                                                {project.description}
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

                            {expanded === project.id && (
                                <div className="flex flex-col gap-0.5 px-4 pb-2">
                                    {bullets[project.id]?.map((bullet, index) => (
                                        <div
                                            key={bullet.id}
                                            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
                                        >
                                            <span className="text-neutral-600 shrink-0 text-xs leading-none select-none">•</span>
                                            <input
                                                ref={el => inputRefs.current[index] = el}
                                                value={bullet.text}
                                                className="bg-transparent outline-none text-sm text-neutral-300 w-full placeholder-neutral-700 focus:text-white transition-colors"
                                                placeholder="...task"
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
'use client'
import {useEffect, useState} from "react";

export default function Study() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDaysLeft = (deadline) => {
       return Math.ceil((new Date(deadline) - new Date()) / 86400000);
    };

    const getColor = (days) => {
        if (days <= 0) return 'bg-red-400';
        if (days <= 3) return 'bg-red-700';
        if (days <= 5) return 'bg-orange-800';
        if (days <= 7) return 'bg-orange-400';
        if (days <= 10) return 'bg-green-600';
        if (days <= 14) return 'bg-green-200';
        if (days > 14) return 'bg-neutral-700';
        return 'bg-neutral-900';
    }

    useEffect(() => {
        setLoading(true);

        fetch('/api/study')
            .then(res => res.json())
            .then(data => setSubjects(data))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="animate-pulse flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-neutral-800 rounded-full shrink-0" />
                <div className="h-6 w-10 bg-neutral-800 rounded" />
                <div className="h-4 w-24 bg-neutral-800 rounded" />
            </div>
            <div className="h-3 w-48 bg-neutral-800 rounded" />
            <div className="h-3 w-36 bg-neutral-800 rounded" />
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col h-full w-full gap-2 overflow-y-auto scrollbar-hide">
                {subjects.map((subject) => (
                    <div className="w-full flex items-center gap-2"
                         key={subject.id}
                    >
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${getColor(getDaysLeft(subject.deadline))}`} />
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-sm text-neutral-200 truncate">
                                    {subject.name}
                                </p>
                                {subject.tasks &&
                                    <p className="text-xs text-neutral-500 truncate">
                                        {subject.tasks}
                                    </p>
                                }
                            </div>
                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                                {getDaysLeft(subject.deadline)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
'use client'
import {useEffect, useRef, useState} from "react";

export default function Study(props) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/study')
            .then(res => res.json())
            .then(setSubjects)
            .then(setLoading(false))
    }, [subjects]);

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
        <div>
            loading
        </div>
    );
}
'use client'
import {useEffect, useRef, useState} from "react";

function Notes() {
    const [categories, setCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [notes, setNotes] = useState([]);
    const [cache, setCache] = useState({});

    const inputRefs = useRef([]);

    useEffect(() => {
        fetch(`/api/notes`)
            .then(res => res.json())
            .then(setCategories);
    }, []);

    useEffect(() => {
        if (categories.length < 1) return;
        const currCategory = categories[currentIndex];
        if (cache[currCategory.id]) {
            setNotes(cache[currCategory.id]);
            return;
        } else {
            fetch(`/api/notes?pageId=${currCategory.id}`)
                .then(res => res.json())
                .then(data => {
                    setNotes(data);
                    setCache(prev => ({...prev, [currCategory.id]: data}));
                });
        }
    }, [categories, currentIndex, cache]);

    const currCategory = categories[currentIndex];

    return (
        <div className="flex flex-col h-full w-full gap-1">

            <div className="flex items-center justify-between px-2 mb-1 shrink-0">
                <button
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    className="text-neutral-600 hover:text-neutral-300 transition-colors text-base leading-none cursor-pointer disabled:opacity-20"
                    disabled={currentIndex === 0}
                >
                    ←
                </button>

                <span className="text-sm text-neutral-200 uppercase tracking-widest font-medium truncate px-2">
                    {currCategory?.title ?? '—'}
                </span>

                <button
                    onClick={() => setCurrentIndex(i => Math.min(categories.length - 1, i + 1))}
                    className="text-neutral-600 hover:text-neutral-300 transition-colors text-base leading-none cursor-pointer disabled:opacity-20"
                    disabled={currentIndex === categories.length - 1}
                >
                    →
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 flex flex-col gap-0.5">
                {notes.map((note, index) => (
                    <div
                        key={note.id}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors group"
                    >
                        <span className="text-neutral-600 shrink-0 text-xs leading-none select-none">•</span>
                        <input
                            ref={el => inputRefs.current[index] = el}
                            value={note.text}
                            className="bg-transparent outline-none text-sm text-neutral-300 w-full placeholder-neutral-700 focus:text-white transition-colors"
                            placeholder="...note"
                            onChange={e => setNotes(notes.map((n, i) =>
                                i !== index ? n : {...n, text: e.target.value}
                            ))}
                            onBlur={() => {
                                fetch(`/api/notes?blockId=${note.id}`, {
                                    method: 'PATCH',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({text: note.text})
                                });
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    fetch(`/api/notes?pageId=${currCategory?.id}`, {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({text: "", pageId: currCategory?.id})
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            const newNote = {id: data.id, text: ""};
                                            const newNotes = [
                                                ...notes.slice(0, index + 1),
                                                newNote,
                                                ...notes.slice(index + 1)
                                            ];
                                            setNotes(newNotes);
                                            setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
                                        });
                                } else if (e.key === 'Backspace' && note.text === '') {
                                    e.preventDefault();
                                    setNotes(notes.filter((_, i) => i !== index));
                                    inputRefs.current = [];
                                    fetch(`/api/notes?blockId=${note.id}`, {method: 'DELETE'})
                                        .then(res => res.json());
                                    if (index > 0)
                                        setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notes;
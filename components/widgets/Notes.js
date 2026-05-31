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
        if(cache[currCategory.id]){
            setNotes(cache[currCategory.id]);
            return;
        } else {
            fetch(`/api/notes?pageId=${currCategory.id}`)
                .then(res => res.json())
                .then(data => {
                    setNotes(data)
                    setCache(prev => ({...prev, [currCategory.id]: data}))
                });
        }
    }, [categories, currentIndex, cache]);

    const currCategory = categories[currentIndex];

    return (
        <div>
            <div className="flex items-center justify-between">
                <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}>←</button>
                <span>{currCategory?.title}</span>
                <button onClick={() => setCurrentIndex(i => Math.min(categories.length - 1, i + 1))}>→</button>
            </div>

            {notes.map((note, index) => (
                <input
                    key={note.id}
                    ref={el => inputRefs.current[index] = el}
                    value={note.text}
                    onChange={e => setNotes(notes.map((n, i) =>
                        i !==index ? n : {...n, text: e.target.value}
                    ))}
                    onBlur={() => {
                        fetch(`/api/notes?blockId=${note.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: note.text })
                        });
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter'){
                            e.preventDefault();
                            fetch(`/api/notes?pageId=${currCategory?.id}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    text: "",
                                    pageId: currCategory?.id
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    const newNote = { id: data.id, text: "" };
                                    const newNotes = [
                                        ...notes.slice(0, index + 1),
                                        newNote,
                                        ...notes.slice(index + 1)
                                    ];
                                    setNotes(newNotes);
                                    setTimeout(() => inputRefs.current[index + 1].focus(), 0);
                                });
                        } else if (e.key === 'Backspace' && note.text === ''){
                            e.preventDefault();
                            setNotes(notes.filter((_, i) => i !== index));
                            inputRefs.current = [];
                            fetch(`/api/notes?blockId=${note.id}`, {
                                method: 'DELETE',
                            }).then(res => res.json());
                            if(index > 0)
                                setTimeout(() => inputRefs.current[index - 1].focus(), 0);
                        }
                    }}
                />
            ))}
        </div>
    );
}

export default Notes;
'use client';
import {useEffect, useState, useRef} from "react";

function HabitTracker() {
    const today = new Date().toISOString().split('T')[0];
    const [contextMenu, setContextMenu] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        fetch('/api/habits')
            .then(r => r.json())
            .then(setHabits);
    }, []);

    const toggleHabit = async (habit) => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        setHabits(habits.map(h => {
            if (h.id !== habit.id) return h;
            if (habit.lastDate === today)
                return { ...h,
                    lastDate: yesterday,
                    done: false,
                    streak: h.streak - 1
            };
            if (habit.lastDate === yesterday)
                return { ...h,
                    lastDate: today,
                    done: true,
                    streak: h.streak + 1
            };
            return { ...h,
                lastDate: today,
                done: true,
                streak: 1
            };
        }));
        await fetch(`/api/habits?id=${habit.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ streak: newStreak, lastChecked: newLastChecked })
        });
    };

    const addHabit = (name) => {
        if (!name.trim()) {
            setIsAdding(false);
            return;
        }
        setHabits([...habits, {
            id: crypto.randomUUID(), name, streak: 0,
            done: false, lastDate: null, isEditing: false
        }]);
        setIsAdding(false);
    };

    const deleteHabit = (habitId) => {
        setHabits(prev => prev.filter(h => h.id !== habitId));
    };

    const handleContextMenu = (e, habit) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, habitId: habit.id });
    };

    const holdTimer = useRef(null);
    const handleTouchStart = (e, habit) => {
        holdTimer.current = setTimeout(() => {
            const touch = e.touches[0];
            setContextMenu({ x: touch.clientX, y: touch.clientY, habitId: habit.id });
        }, 500);
    };
    const handleTouchEnd = () => clearTimeout(holdTimer.current);

    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    return (
        <div className="flex flex-col gap-1">
            {habits.map(habit => (
                <div
                    key={habit.id}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-neutral-900 transition-colors group"
                    onContextMenu={(e) => handleContextMenu(e, habit)}
                    onTouchStart={(e) => handleTouchStart(e, habit)}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* чекбокс */}
                    <div
                        onClick={() => toggleHabit(habit)}
                        className={`w-4 h-4 rounded-sm border flex-shrink-0 cursor-pointer transition-colors ${
                            habit.done
                                ? 'bg-white border-white'
                                : 'border-neutral-600 hover:border-neutral-400'
                        }`}
                    />

                    {habit.isEditing ? (
                        <input
                            className="flex-1 bg-transparent text-sm text-white outline-none border-b border-neutral-600"
                            value={habit.name}
                            onChange={(e) => setHabits(habits.map(h =>
                                h.id === habit.id ? { ...h, name: e.target.value } : h
                            ))}
                            onBlur={() => setHabits(habits.map(h =>
                                h.id === habit.id ? { ...h, isEditing: false } : h
                            ))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setHabits(habits.map(h =>
                                    h.id === habit.id ? { ...h, isEditing: false } : h
                                ));
                            }}
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => toggleHabit(habit)}
                            className={`flex-1 text-sm cursor-pointer transition-colors ${
                                habit.done ? 'line-through text-neutral-600' : 'text-neutral-300'
                            }`}
                        >
                            {habit.name}
                        </span>
                    )}

                    <span className="text-xs text-neutral-600 tabular-nums">
                        {habit.streak > 0 ? `${habit.streak}d` : ''}
                    </span>
                </div>
            ))}

            {isAdding ? (
                <input
                    className="px-2 py-1.5 text-sm bg-transparent text-white outline-none border-b border-neutral-700 placeholder-neutral-700"
                    onBlur={(e) => addHabit(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') addHabit(e.target.value);
                        if (e.key === 'Escape') setIsAdding(false);
                    }}
                    autoFocus
                    placeholder="New habit..."
                />
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors text-left px-2 py-1"
                >
                    + add habit
                </button>
            )}

            {/* context menu */}
            {contextMenu && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="fixed z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
                        onClick={() => {
                            setHabits(habits.map(h =>
                                h.id === contextMenu.habitId ? { ...h, isEditing: true } : h
                            ));
                            setContextMenu(null);
                        }}
                    >Edit</button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-800 transition-colors"
                        onClick={() => {
                            deleteHabit(contextMenu.habitId);
                            setContextMenu(null);
                        }}
                    >Delete</button>
                </div>
            )}
        </div>
    );
}

export default HabitTracker;
'use client';
import {useEffect, useState, useRef} from "react";

function HabitTracker() {
    const today = new Date().toISOString().split('T')[0];
    const [contextMenu, setContextMenu] = useState(null);
    const [habits, setHabits] = useState([
        { id: '1', name: 'Stretching', streak: 0, done: false, lastDate: null, isEditing: false },
        { id: '2', name: 'Reading',    streak: 0, done: false, lastDate: null, isEditing: false },
    ]);

    //habit
    const toggleHabit = (habit) => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        setHabits(habits.map(h => {
            if(h.id !== habit.id) {return h;}

            if (habit.lastDate === today) {
                return { ...h,
                    lastDate: yesterday,
                    done: false,
                    streak: h.streak-1
                }
            } else if (habit.lastDate === yesterday) {
                return { ...h,
                    lastDate: today,
                    done: true,
                    streak: h.streak+1
                }
            } else {
                return { ...h,
                    lastDate: today,
                    done: true,
                    streak: 1
                }
            }
        }));
    }

    const deleteHabit = (habitId) => {
        setHabits(habits => habits.filter(h => h.id !== habitId));
    }

    //menu
    const handleContextMenu = (e, habit) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            habitId: habit.id
        });
    };

    //mobile context menu
    const holdTimer = useRef(null);

    const handleTouchStart = (e, habit) => {
        holdTimer.current = setTimeout(() => {
            const touch = e.touches[0];
            setContextMenu({
                x: touch.clientX,
                y: touch.clientY,
                habitId: habit.id
            });
        }, 500);
    };

    const handleTouchEnd = () => {
        clearTimeout(holdTimer.current);
    };

    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    return (
        <div>
            {habits.map(habit => (
                <div key={habit.id} className="habit" onContextMenu={(e) => handleContextMenu(e, habit)}>
                    <input className={""}
                           type={"checkbox"}
                           onChange={()=> toggleHabit(habit)}
                           checked={habit.done}/>
                    <span onClick={(e) => {
                        e.stopPropagation();
                        toggleHabit(habit);
                    }}>
                        {habit.name}
                    </span>
                    <span>
                        {habit.streak}
                    </span>
                </div>
            ))
            }

            {contextMenu && (
                <div style={{
                    position: 'fixed',
                    top: contextMenu.y,
                    left: contextMenu.x
                }}>
                    <button onClick={() =>{
                        setHabits(habits.map(h =>
                            h.id === contextMenu.habitId ? {...h, isEditing: true} : h));
                        setContextMenu(null);
                    }}>Edit</button>
                    <button onClick={() => {Delete}}>Delete</button>
                </div>
            )}

            {habit.isEditing ? (
                <input
                    value={habit.name}
                    onChange={...}   // что должно происходить при вводе?
                    onBlur={...}     // что происходит когда инпут теряет фокус?
                    autoFocus
                />
            ) : (
                <span>{habit.name}</span>
            )}
        </div>
    )
}

export default HabitTracker;
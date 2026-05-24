'use client';
import {useState} from "react";


function HabitTracker() {
    const today = new Date().toISOString().split('T')[0];
    const [habits, setHabits] = useState([
        { id: '1', name: 'Stretching', streak: 0, done: false, lastDate: null },
        { id: '2', name: 'Reading',    streak: 0, done: false, lastDate: null },
    ]);

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

    return (
        <div>
            {habits.map(habit => (
                <div key={habit.id} className="habit">
                    <input className={""}
                           type={"checkbox"}
                           onChange={()=> toggleHabit(habit)}
                           checked={habit.done}/>
                    <span> {habit.name} </span>
                    <span> {habit.streak} </span>
                </div>
            ))
            }
        </div>
    )
}

export default HabitTracker;
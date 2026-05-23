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
        if(habit.lastDate === today) {
            habit.done = false;
            habit.streak--;
        } else if (habit.lastDate === yesterday) {
            habit.done = true;
            habit.lastDate = today;
            habit.streak++;
        } else {
            habit.done = true;
            habit.lastDate = today;
            habit.streak++;
        }
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
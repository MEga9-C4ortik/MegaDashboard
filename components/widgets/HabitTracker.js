'use client';
import {useState} from "react";


function HabitTracker() {
    const today = new Date().toISOString().split('T')[0];
    const [habits, setHabits] = useState([
        { id: '1', name: 'Stretching', streak: 0, done: false, lastDate: null },
        { id: '2', name: 'Reading',    streak: 0, done: false, lastDate: null },
    ]);

    const toggleHabit = (habit) => {
        if(lastDate === today) {

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
'use client';
import {useState} from "react";


function HabitTracker() {
    const today = new Date().toISOString().split('T')[0];
    const [habits, setHabits] = useState([]);

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
                           value={habit.name}
                           onChange={()=> toggleHabit(habit)}
                           checked={habit.done}/>
                </div>
                ))
            }
        </div>
    )
}

export default HabitTracker;
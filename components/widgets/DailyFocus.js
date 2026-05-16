'use client';
import { useState } from 'react';

function DailyFocus() {
    const [dailyFocus, setDailyFocus] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    return(
        <div>
            {isEditing?
                <input
                    value={dailyFocus}
                    onChange={e => setDailyFocus(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter')
                            setIsEditing(false);
                        e.preventDefault();
                        }
                    }
                    autoFocus={true}
                />
                : <p onClick={() => setIsEditing(true)}>
                    {dailyFocus || "Click to set your daily focus..."}
                </p>
            }
        </div>
    );
}

export default DailyFocus;
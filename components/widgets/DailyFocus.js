'use client';
import { useState, useEffect } from 'react';

function DailyFocus() {
    const [dailyFocus, setDailyFocus] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dailyFocus');
        if (saved) setDailyFocus(saved);
    }, []);

    const handleSave = () => {
        localStorage.setItem('dailyFocus', dailyFocus);
    };

    return(
        <div>
            {isEditing?
                <input
                    value={dailyFocus}
                    onChange={e => setDailyFocus(e.target.value)}
                    onBlur={() => {
                        setIsEditing(false);
                        handleSave();
                    }
                    }
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            setIsEditing(false);
                            e.preventDefault();
                            handleSave();
                        }
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
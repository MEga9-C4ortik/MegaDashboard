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
                    className="text-3xl font-semibold bg-transparent border-b border-neutral-500 outline-none text-white w-full"
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
                : <p className={"text-3xl font-semibold text-white cursor-pointer hover:text-neutral-300 transition-colors"}
                    onClick={() => setIsEditing(true)
                    }>
                    {dailyFocus ||
                        <span className={"text-neutral-600"}>
                            Click to set your daily focus...
                        </span>}
                </p>
            }
        </div>
    );
}

export default DailyFocus;
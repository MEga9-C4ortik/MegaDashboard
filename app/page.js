'use client';

import {useState, useEffect} from "react";
import DailyFocus from "../components/widgets/DailyFocus";

export default function Home() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            <div className="time">
                {now.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).replaceAll(","," ")}{" | "}
                {now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                })}
            </div>

            <div className="daily-focus">
                <DailyFocus />
            </div>
        </>
    )
}
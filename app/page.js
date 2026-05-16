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
            <div className="date">
                {now.toLocaleDateString("en-US")}{" "}
                {now.toLocaleTimeString("en-US")}
            </div>

            <div className="daily-focus">
                <DailyFocus />
            </div>
        </>
    )
}
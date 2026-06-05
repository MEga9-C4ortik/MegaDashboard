import { useRef, useState, useEffect } from "react";

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view , setView] = useState(false);
    const cache = useRef({});

    useEffect(() => {
        const dateStr = selectedDate;

        if (cache.current[dateStr]) {
            setEvents(cache.current[dateStr]);
            return;
        }

        setLoading(true);
        fetch(`/api/calendar?date=${dateStr}`)
            .then(res => res.json())
            .then(data => {
                cache.current[dateStr] = data;
                setEvents(data);
                setLoading(false);
            });
    }, [selectedDate]);

    return (
        <div className="flex flex-col h-full w-full gap-2">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <button onClick={() => {/* предыдущий день */}}>←</button>
                <span onClick={() => setView(true)}>{selectedDate}</span>
                <button onClick={() => {/* следующий день */}}>→</button>
            </div>

            {/* Events */}
            <div className="flex flex-col gap-1 overflow-y-auto">
                {events.map(event => (
                    <div key={event.id}>
                        {event.summary}
                    </div>
                ))}
            </div>
        </div>
    );
}
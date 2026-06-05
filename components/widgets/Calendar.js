import { useRef, useState, useEffect } from "react";

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view , setView] = useState(false);
    const cache = useRef({});
    const scrollRef = useRef(null);

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

    const timeToMinutes = (dateTimeStr) => {
        const hours =  new Date(dateTimeStr).getHours();
        const minutes =  new Date(dateTimeStr).getMinutes();
        return hours * 60 + minutes;
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = timeToMinutes(new Date()) - 200;
        }
    }, []);

    const changeDay = (delta) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + delta);
        setSelectedDate(date.toLocaleDateString("en-CA"));
    };

    return (
        <div className="flex flex-col h-full w-full gap-2">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <button onClick={() => changeDay(-1)}>←</button>
                <span onClick={() => setView(true)} className="text-sm text-neutral-200 font-medium cursor-pointer hover:text-white transition-colors">
                    {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button onClick={() => changeDay(+1)}>→</button>
            </div>

            {/* Timeline */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                <div className="relative" style={{ height: '1440px' }}>
                    {Array.from({length: 24}, (_, i) => (
                        <div key={i} style={{ top: `${i * 60}px` }}
                             className="absolute w-full flex items-center gap-1">
                            <span className="text-xs text-neutral-700 w-8 shrink-0">{String(i).padStart(2,'0')}</span>
                            <div className="flex-1 h-px bg-neutral-800/50" />
                        </div>
                    ))}

                    {/* Events */}
                    {events.filter(e => e.start.dateTime).map(event => {
                        const startMin = timeToMinutes(event.start.dateTime);
                        const endMin = timeToMinutes(event.end.dateTime);
                        const top = (startMin / 1440) * 100;
                        const height = ((endMin - startMin) / 1440) * 100;
                        return (
                            <div key={event.id}
                                 style={{ top: `${top}%`, height: `${height}%`, left: '2.5rem' }}
                                 className="absolute right-0 rounded px-1 text-xs">
                                {event.summary}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
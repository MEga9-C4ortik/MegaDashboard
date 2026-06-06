import { useRef, useState, useEffect } from "react";
const GCal_COLORS = {
    '1': '#7986cb',  // Lavender
    '2': '#33b679',  // Sage
    '3': '#8e24aa',  // Grape
    '4': '#e67c73',  // Flamingo
    '5': '#f6c026',  // Banana
    '6': '#f5511d',  // Tangerine
    '7': '#039be5',  // Peacock
    '8': '#616161',  // Graphite
    '9': '#3f51b5',  // Blueberry
    '10': '#0b8043', // Basil
    '11': '#d60000', // Tomato
};

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

    const getEventColor = (event) =>
        GCal_COLORS[event.colorId] ?? '#4285f4';

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault();
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'KeyA') changeDay(-1);
            if (e.code === 'KeyD') changeDay(1);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedDate]);

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
                <div className="relative" style={{ height: '1080px' }}>
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
                        const top = startMin * 0.75;
                        const height = (endMin - startMin) * 0.75;
                        const color = event.colorId ?? 'default';
                        return (
                            <div key={event.id}
                                 style={{
                                     top: top,
                                     height: height,
                                     left: '2.5rem',
                                     backgroundColor: getEventColor(event) + '40', // 40 = 25% opacity
                                     borderLeft: `2px solid ${getEventColor(event)}`,
                                }}
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
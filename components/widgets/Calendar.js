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

const OFFSET = 10;

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

    useEffect(() => {
        const close = () => setSelectedEvent(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const changeDay = (delta) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + delta);
        setSelectedDate(date.toLocaleDateString("en-CA"));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'KeyA') changeDay(-1);
            if (e.code === 'KeyD') changeDay(1);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedDate]);

    const toTimeStr = (dateTimeStr) => {
        const d = new Date(dateTimeStr);
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }

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

            {/* All day events */}
            <div className="flex flex-wrap gap-1 shrink-0">
                {events.filter(e => e.start.date).map(event => (
                    <div key={event.id}
                         style={{
                             backgroundColor: getEventColor(event) + '30',
                             borderColor: getEventColor(event)
                         }}
                         className="text-xs px-2 py-0.5 w-full text-center rounded-md border text-neutral-200 truncate">
                        {event.summary}
                    </div>
                ))}
            </div>

            <div className="flex flex-1 gap-2 min-h-0">
                {/* Timeline */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                    <div className="relative" style={{ height: `${1080 + OFFSET * 2}px` }}>
                        {Array.from({length: 24}, (_, i) => (
                            <div key={i} style={{ top: `${i * 45 + OFFSET}px` }}
                                 className="absolute w-full flex items-center gap-1 -translate-y-1/2">
                                <span className="text-xs text-neutral-600 w-8 shrink-0">{String(i).padStart(2,'0')}</span>
                                <div className="flex-1 h-px bg-neutral-800/50" />
                            </div>
                        ))}

                        {/* Events */}
                        {events.filter(e => e.start.dateTime).map(event => {
                            const startMin = timeToMinutes(event.start.dateTime);
                            const endMin = timeToMinutes(event.end.dateTime);
                            const top = startMin * 0.75;
                            const height = (endMin - startMin) * 0.75;
                            return (
                                <div key={event.id}
                                     style={{
                                         top: `${top + OFFSET}px`,
                                         height: `${height}px`,
                                         right: 0,
                                         left: '2.5rem',
                                         backgroundColor: getEventColor(event) + '40', // 40 = 25% opacity
                                         borderLeft: `5px solid ${getEventColor(event)}`,
                                     }}
                                     className="absolute rounded px-1 text-xs cursor-pointer"
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         setSelectedEvent(selectedEvent?.id === event.id ? null : event);
                                     }}
                                >
                                    {event.summary}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedEvent && (
                    <div className="w-32 shrink-0 flex flex-col gap-1 text-xs pt-2">
                        <span className="text-sm text-neutral-200 font-medium">
                            {selectedEvent.summary}
                        </span>
                        <span className="text-sm text-neutral-200 font-medium">
                            {toTimeStr(selectedEvent.start.dateTime)} – {toTimeStr(selectedEvent.end.dateTime)}
                        </span>
                        {selectedEvent.location && (
                            <span className="text-sm text-neutral-300">Location: {selectedEvent.location}</span>
                        )}
                        {selectedEvent.description && (
                            <span className="text-neutral-600 text-xs leading-tight">{selectedEvent.description}</span>
                        )}
                        <a href={selectedEvent.htmlLink} target="_blank"
                           className="text-blue-400 hover:text-blue-300 mt-auto">
                            Open →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
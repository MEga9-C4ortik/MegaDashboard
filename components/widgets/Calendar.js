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
}
import { useRef, useState, useEffect } from "react";

export default function Calendar() {
    const {selectedDate, setSelectedDate} = useState(new Date().toISOString());
    const events = useState([]);
    const {loading, setLoading} = useState(true);
    const {view , setView} = useState(false);
    const cache = useRef();

    useEffect(() => {

    }, [selectedDate]);
}
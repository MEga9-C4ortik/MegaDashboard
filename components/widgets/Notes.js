'use client'
import {useEffect, useState} from "react";

function Notes() {
    const [categories, setCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [notes, setNotes] = useState([]);
    const [cache, setCache] = useState({});

    useEffect(() => {
        fetch(`/api/notes`)
            .then(res => res.json())
            .then(setCategories);
    }, []);

    useEffect(() => {
        if (categories.length < 1) return;
        const currCategory = categories[currentIndex];
        if(cache[currCategory.id]){
            setNotes(cache[currCategory.id]);
        } else {
            fetch(`/api/notes?pageId=${currCategory.id}`)
                .then(res => res.json())
                .then(data => {
                    setNotes(data)
                    setCache({...cache, [currCategory.id]: data})
                });
        }
    }, [categories, currentIndex]);


}
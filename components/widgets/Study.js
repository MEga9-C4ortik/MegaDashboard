'use client'
import {useEffect, useRef, useState} from "react";

export default function Study(props) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('api/study')
            .then(res => res.json())
            .then(setSubjects);
    }, [subjects]);


}
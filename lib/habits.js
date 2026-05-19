export function getHabits() {
    const saved = localStorage.getItem('habits');
    if (saved) return JSON.parse(saved);

    return [
        { id: "leetcode", label: "LeetCode",    type: "daily",  streak: 0, lastChecked: null },
        { id: "reading",  label: "Reading",     type: "daily",  streak: 0, lastChecked: null },
        { id: "workout",  label: "Workout",     type: "weekly", countThisWeek: 0, weekStart: null },
        { id: "judo",     label: "Judo",        type: "weekly", countThisWeek: 0, weekStart: null },
    ];
}


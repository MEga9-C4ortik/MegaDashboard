export function getHabits() {
    const saved = localStorage.getItem('habits');
    if (saved) return JSON.parse(saved);

    return [
    ];
}


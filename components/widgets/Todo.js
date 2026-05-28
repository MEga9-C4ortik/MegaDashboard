'use client'
import { useEffect, useState, useRef } from "react";

function Todo() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('/api/todo')
            .then(r => r.json())
            .then(setCategories);
    }, []);

    const toggleTodo = async (categoryIdx, todoId, checked) => {
        setCategories(categories.map((cat, idx) =>
            idx !== categoryIdx ? cat : {
                ...cat,
                todos: cat.todos.map(t =>
                    t.id !== todoId ? t : { ...t, checked: !checked }
                )
            }
        ));

        await fetch(`/api/todo`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: todoId,
                checked: !checked
            })
        });
    };

    return (
        <div>
            {categories.map(category => (
                <div key={category.category}>
                    <h3>{category.category}</h3>
                    {category.todos.map(todo => (
                        <div key={todo.id}>
                            <div
                                onClick={() => toggleTodo(category.id, todo.id, todo.checked)}
                                className={`w-4 h-4 rounded-sm border shrink-0 cursor-pointer transition-colors ${
                                    todo.checked
                                        ? 'bg-white border-white'
                                        : 'border-neutral-600 hover:border-neutral-400'
                                }`}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Todo;
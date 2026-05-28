'use client'
import { useEffect, useState } from "react";

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

        await fetch('/api/todo', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: todoId, checked: !checked })
        });
    };

    return (
        <div className="grid grid-cols-3 gap-3 h-full scrollbar-hide overflow-x-auto">
            {categories.map((category, idx) => (
                <div key={category.category} className="flex flex-col gap-1">
                    <h3 className="text-xs text-neutral-500 uppercase tracking-widest px-2 mb-1">
                        {category.category}
                    </h3>
                    {category.todos.map(todo => (
                        <div
                            key={todo.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg scrollbar-hide hover:bg-neutral-800 transition-colors cursor-pointer"
                            onClick={() => toggleTodo(idx, todo.id, todo.checked)}
                        >
                            <div className={`w-4 h-4 rounded-sm border shrink-0 transition-colors ${
                                todo.checked
                                    ? 'bg-white border-white'
                                    : 'border-neutral-600 hover:border-neutral-400'
                            }`} />
                            <span className={`text-sm transition-colors ${
                                todo.checked
                                    ? 'line-through text-neutral-600'
                                    : 'text-neutral-300'
                            }`}>
                                {todo.name}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Todo;
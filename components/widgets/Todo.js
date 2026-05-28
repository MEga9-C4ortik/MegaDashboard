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
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide h-full">
            {categories.map((category, idx) => (
                <div key={category.category}>
                    <h3 className="text-xs text-neutral-500 uppercase tracking-widest px-2 mb-1">
                        {category.category}
                    </h3>
                    {category.todos.map(todo => (
                        <div key={todo.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <div
                                onClick={() => toggleTodo(idx, todo.id, todo.checked)}
                                className={`w-4 h-4 rounded-sm border shrink-0 cursor-pointer transition-colors ${
                                    todo.checked
                                        ? 'bg-white border-white'
                                        : 'border-neutral-600 hover:border-neutral-400'
                                }`}
                            />
                            <span className={`text-sm cursor-pointer transition-colors ${
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
import { useEffect, useState, useRef } from "react";


export function Todo() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('/api/todo')
            .then(r => r.json())
            .then(setCategories);
    }, []);

    const toggleTodo = async (categoryIdx, todoId, checked) => {

    };

    return (
        <div>
            {categories.map(category => (
                <div key={category.category}>
                    <h3>{category.category}</h3>
                    {category.todos.map(todo => (
                        <div key={todo.id}>
                            {/* чекбокс + название */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
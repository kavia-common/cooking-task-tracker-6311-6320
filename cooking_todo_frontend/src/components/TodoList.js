import React, { useMemo } from 'react';
import { format } from '../utils/date';

// PUBLIC_INTERFACE
export default function TodoList({ todos, onToggle, onDelete, onEdit, onAttachRecipe }) {
  /** Render a list of todos with actions to toggle complete, edit, delete, and attach a recipe. */
  const sorted = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [todos]);

  if (sorted.length === 0) {
    return <div className="empty">No tasks yet. Add your first cooking task! 🧑‍🍳</div>;
  }

  return (
    <ul className="list">
      {sorted.map((t) => (
        <li key={t.id} className={`card todo ${t.completed ? 'completed' : ''}`}>
          <div className="todo-main">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => onToggle(t.id)}
                aria-label={`Mark ${t.title} as ${t.completed ? 'incomplete' : 'complete'}`}
              />
              <span />
            </label>
            <div className="todo-content">
              <div className="todo-title">{t.title}</div>
              {t.notes && <div className="todo-notes">{t.notes}</div>}
              <div className="todo-meta">
                {t.dueDate && <span className="badge">Due: {format(t.dueDate)}</span>}
                {t.estimatedTime && <span className="badge">⏱ {t.estimatedTime} min</span>}
                {t.recipeId && (
                  <span className="badge badge-link" onClick={() => onAttachRecipe(t.id)}>
                    🍲 Linked to Recipe
                  </span>
                )}
                {t.tags && t.tags.length > 0 && (
                  <span className="tags">{t.tags.map((tag) => <em key={tag}>#{tag}</em>)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => onAttachRecipe(t.id)} title="Attach or change recipe">🍲</button>
            <button className="btn" onClick={() => onEdit(t.id)} title="Edit task">✏️</button>
            <button className="btn btn-danger" onClick={() => onDelete(t.id)} title="Delete task">🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

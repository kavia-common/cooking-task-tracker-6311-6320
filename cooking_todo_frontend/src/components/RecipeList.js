import React, { useMemo } from 'react';

// PUBLIC_INTERFACE
export default function RecipeList({ recipes, onSelect, onEdit, onDelete }) {
  /** Display recipes with select, edit, delete actions. */
  const sorted = useMemo(() => {
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
  }, [recipes]);

  if (sorted.length === 0) {
    return <div className="empty">No recipes yet. Create one to link with tasks. 🍽️</div>;
  }

  return (
    <ul className="list">
      {sorted.map((r) => (
        <li key={r.id} className="card recipe">
          <div className="recipe-main">
            <div className="recipe-title">{r.title}</div>
            {r.description && <div className="recipe-desc">{r.description}</div>}
            {r.ingredients?.length > 0 && (
              <div className="recipe-ingredients">
                <strong>Ingredients:</strong> {r.ingredients.join(', ')}
              </div>
            )}
          </div>
          <div className="actions">
            {onSelect && (
              <button className="btn btn-primary" onClick={() => onSelect(r.id)} title="Select recipe">
                Select
              </button>
            )}
            <button className="btn" onClick={() => onEdit(r.id)} title="Edit recipe">✏️</button>
            <button className="btn btn-danger" onClick={() => onDelete(r.id)} title="Delete recipe">🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

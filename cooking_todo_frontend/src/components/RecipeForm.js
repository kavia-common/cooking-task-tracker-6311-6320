import React, { useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function RecipeForm({ initial, onCancel, onSave }) {
  /**
   * Controlled recipe form.
   * Fields: title (required), description, ingredients (comma separated), steps (multiline)
   */
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [ingredients, setIngredients] = useState((initial?.ingredients || []).join(', '));
  const [steps, setSteps] = useState(initial?.steps || '');
  const canSave = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    const payload = {
      ...initial,
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients
        ? ingredients.split(',').map((i) => i.trim()).filter(Boolean)
        : [],
      steps: steps.trim(),
    };
    onSave(payload);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>Title<span className="req">*</span></label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Spaghetti Bolognese" required />
      </div>

      <div className="form-row">
        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short recipe description" />
      </div>

      <div className="form-row">
        <label>Ingredients</label>
        <input value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="comma, separated, ingredients" />
      </div>

      <div className="form-row">
        <label>Steps</label>
        <textarea rows={5} value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Instructions..." />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!canSave}>
          {initial?.id ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </div>
    </form>
  );
}

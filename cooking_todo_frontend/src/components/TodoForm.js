import React, { useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function TodoForm({ initial, onCancel, onSave }) {
  /**
   * A controlled form for adding/editing a todo.
   * Fields: title (required), notes, dueDate, estimatedTime, tags (comma separated)
   */
  const [title, setTitle] = useState(initial?.title || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? initial.dueDate.substring(0, 10) : '');
  const [estimatedTime, setEstimatedTime] = useState(initial?.estimatedTime || '');
  const [tags, setTags] = useState((initial?.tags || []).join(', '));
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [title, notes, dueDate, estimatedTime, tags]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) {
      setError('Title is required.');
      return;
    }
    const payload = {
      ...initial,
      title: title.trim(),
      notes: notes.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      tags: tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    onSave(payload);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>Title<span className="req">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Chop onions, preheat oven..."
          required
        />
      </div>

      <div className="form-row">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Steps, reminders, tools, etc."
          rows={3}
        />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Est. time (min)</label>
          <input
            type="number"
            min="0"
            step="5"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g., 15"
          />
        </div>
      </div>

      <div className="form-row">
        <label>Tags</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="comma, separated, tags"
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!canSave}>
          {initial?.id ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

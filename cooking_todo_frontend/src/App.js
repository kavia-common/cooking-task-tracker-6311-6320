import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import { loadState, savePrefs, saveRecipes, saveTodos } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * Cooking Todo Frontend
   * - Manage cooking-related todos
   * - Manage recipes
   * - Link a todo to a recipe
   * - Persist state to localStorage (no backend dependency)
   */

  const { todos: initTodos, recipes: initRecipes, prefs: initPrefs } = loadState();

  const [theme, setTheme] = useState(initPrefs?.theme || 'light');
  const [todos, setTodos] = useState(initTodos);
  const [recipes, setRecipes] = useState(initRecipes);

  // UI state
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [query, setQuery] = useState('');

  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const [attachForTodoId, setAttachForTodoId] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    savePrefs({ theme });
  }, [theme]);

  // Persist changes
  useEffect(() => { saveTodos(todos); }, [todos]);
  useEffect(() => { saveRecipes(recipes); }, [recipes]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Derived state
  const filteredTodos = useMemo(() => {
    let list = todos;
    if (filter === 'active') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes || '').toLowerCase().includes(q) ||
          (t.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    }
    return list;
  }, [todos, filter, query]);

  const editingTodo = useMemo(() => todos.find((t) => t.id === editingTodoId), [todos, editingTodoId]);
  const editingRecipe = useMemo(() => recipes.find((r) => r.id === editingRecipeId), [recipes, editingRecipeId]);

  // Todo actions
  const addTodo = () => {
    setEditingTodoId(null);
    setShowTodoForm(true);
  };

  const handleSaveTodo = (payload) => {
    if (payload.id) {
      setTodos((prev) => prev.map((t) => (t.id === payload.id ? { ...t, ...payload } : t)));
    } else {
      const newTodo = { ...payload, id: crypto.randomUUID(), completed: false, recipeId: payload.recipeId || null };
      setTodos((prev) => [newTodo, ...prev]);
    }
    setShowTodoForm(false);
    setEditingTodoId(null);
  };

  const handleEditTodo = (id) => {
    setEditingTodoId(id);
    setShowTodoForm(true);
  };

  const handleDeleteTodo = (id) => {
    // Also clear attachment state if needed
    if (attachForTodoId === id) setAttachForTodoId(null);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAttachRecipePrompt = (todoId) => {
    setAttachForTodoId(todoId);
    setEditingRecipeId(null);
    setShowRecipeForm(false);
  };

  const handleSelectRecipeForTodo = (recipeId) => {
    const tid = attachForTodoId;
    if (!tid) return;
    setTodos((prev) => prev.map((t) => (t.id === tid ? { ...t, recipeId } : t)));
    setAttachForTodoId(null);
  };

  // Recipe actions
  const addRecipe = () => {
    setEditingRecipeId(null);
    setShowRecipeForm(true);
  };

  const handleSaveRecipe = (payload) => {
    if (payload.id) {
      setRecipes((prev) => prev.map((r) => (r.id === payload.id ? { ...r, ...payload } : r)));
    } else {
      const newRecipe = { ...payload, id: crypto.randomUUID() };
      setRecipes((prev) => [newRecipe, ...prev]);
    }
    setShowRecipeForm(false);
    setEditingRecipeId(null);
  };

  const handleEditRecipe = (id) => {
    setEditingRecipeId(id);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipe = (id) => {
    // Remove links from todos pointing to this recipe
    setTodos((prev) => prev.map((t) => (t.recipeId === id ? { ...t, recipeId: null } : t)));
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('This will remove all tasks and recipes. Continue?')) {
      setTodos([]);
      setRecipes([]);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand">
          <div className="logo" aria-hidden />
          Cooking Todo
        </div>
        <div className="toolbar">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn btn-danger" onClick={clearAll} title="Clear all data">Reset</button>
        </div>
      </nav>

      <main className="container">
        {/* Tasks Section */}
        <section className="section">
          <div className="section-title">
            <span>🧑‍🍳 Cooking Tasks</span>
            <div className="toolbar">
              <input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button className="btn btn-primary" onClick={addTodo}>+ Add Task</button>
            </div>
          </div>

          {showTodoForm && (
            <div className="section" role="dialog" aria-label="Todo form">
              <TodoForm
                initial={editingTodo || null}
                onCancel={() => { setShowTodoForm(false); setEditingTodoId(null); }}
                onSave={handleSaveTodo}
              />
            </div>
          )}

          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            onAttachRecipe={handleAttachRecipePrompt}
          />
        </section>

        {/* Recipe Selection for Attach */}
        {attachForTodoId && (
          <section className="section" role="dialog" aria-label="Attach recipe">
            <div className="section-title">
              <span>Attach a Recipe</span>
              <div className="toolbar">
                <button className="btn btn-secondary" onClick={() => setAttachForTodoId(null)}>Close</button>
              </div>
            </div>
            <RecipeList
              recipes={recipes}
              onSelect={handleSelectRecipeForTodo}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
            />
            <div className="toolbar" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={addRecipe}>+ New Recipe</button>
            </div>
            {showRecipeForm && (
              <div className="section">
                <RecipeForm
                  initial={editingRecipe || null}
                  onCancel={() => { setShowRecipeForm(false); setEditingRecipeId(null); }}
                  onSave={handleSaveRecipe}
                />
              </div>
            )}
          </section>
        )}

        {/* Recipes Section */}
        <section className="section">
          <div className="section-title">
            <span>🍽️ Recipes</span>
            <div className="toolbar">
              <button className="btn btn-primary" onClick={addRecipe}>+ Add Recipe</button>
            </div>
          </div>

          {showRecipeForm && !attachForTodoId && (
            <div className="section" role="dialog" aria-label="Recipe form">
              <RecipeForm
                initial={editingRecipe || null}
                onCancel={() => { setShowRecipeForm(false); setEditingRecipeId(null); }}
                onSave={handleSaveRecipe}
              />
            </div>
          )}

          <RecipeList
            recipes={recipes}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        </section>

        <footer className="footer">
          Data is stored locally in your browser. No account required.
        </footer>
      </main>
    </div>
  );
}

export default App;

const TODOS_KEY = 'cooking.todos.v1';
const RECIPES_KEY = 'cooking.recipes.v1';
const PREF_KEY = 'cooking.prefs.v1';

// PUBLIC_INTERFACE
export function loadState() {
  /** Load todos, recipes, and preferences from localStorage safely. */
  try {
    const todos = JSON.parse(localStorage.getItem(TODOS_KEY) || '[]');
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    const prefs = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    return { todos, recipes, prefs };
  } catch {
    return { todos: [], recipes: [], prefs: {} };
  }
}

// PUBLIC_INTERFACE
export function saveTodos(todos) {
  /** Persist todos to localStorage. */
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

// PUBLIC_INTERFACE
export function saveRecipes(recipes) {
  /** Persist recipes to localStorage. */
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

// PUBLIC_INTERFACE
export function savePrefs(prefs) {
  /** Persist preferences to localStorage. */
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

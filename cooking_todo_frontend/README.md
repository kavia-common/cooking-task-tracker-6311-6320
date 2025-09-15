# Cooking Todo Frontend

A React application for creating, editing, and managing cooking-related todos and recipes with a clean, responsive UI. Data is stored locally in your browser.

## Features

- Add, edit, delete, and complete cooking tasks
- Create and manage recipes
- Attach recipes to tasks
- Filtering and search for tasks
- Light/Dark theme toggle
- LocalStorage persistence (no backend required)

## Getting Started

Install dependencies and start the dev server:

- npm install
- npm start

Then open http://localhost:3000 to view it in your browser.

## Usage

- Use "+ Add Task" to create a cooking task (title required)
- Use "+ Add Recipe" to create a recipe
- Click the 🍲 icon on a task to attach a recipe (or change it)
- Use the search box and filter to find tasks quickly
- Toggle theme with the button on the top-right
- "Reset" clears all data (tasks and recipes) from localStorage

## Project Structure

- src/components/TodoList.js — list and actions for tasks
- src/components/TodoForm.js — form to add/edit tasks
- src/components/RecipeList.js — list and actions for recipes
- src/components/RecipeForm.js — form to add/edit recipes
- src/utils/storage.js — localStorage helpers
- src/utils/date.js — date formatting utilities
- src/App.js — main app composition and state management

## Notes

This app is designed to be backend-agnostic. If you later connect an API or a database service, replace localStorage calls in `src/utils/storage.js` and wire the actions in `src/App.js` to your API.

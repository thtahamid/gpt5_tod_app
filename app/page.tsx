import React from 'react';
import { AddTodoForm, Toolbar, TodoList } from './components';

export default function Page() {
  return (
    <main className="app-shell">
      <h1>Tasks</h1>
      <Toolbar />
      <AddTodoForm />
      <TodoList />
      <footer className="meta">
        <span>Local ephemeral store • Inline edit • Filters</span>
        <span><a href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a></span>
      </footer>
    </main>
  );
}

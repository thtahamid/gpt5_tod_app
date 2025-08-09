"use client";
import React, { useEffect, useState } from 'react';
import { store } from '../app/store';
import { Filter, Todo } from '../app/types';

function useStore<T>(selector: (s: ReturnType<typeof store.getState>) => T): T {
  const [slice, setSlice] = useState(() => selector(store.getState()));
  useEffect(() => {
    const unsubscribe = store.subscribe(() => setSlice(selector(store.getState())));
    return () => { unsubscribe(); };
  // selector is assumed stable (inline usage kept minimal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return slice;
}

export const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    store.addTodo(title);
    setTitle('');
  };
  return (
    <form onSubmit={add} className="add-form" aria-label="Add todo">
      <input
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label="Todo title"
        autoFocus
      />
      <button type="submit" title="Add task">➕ Add</button>
    </form>
  );
};

export const Toolbar: React.FC = () => {
  const filter = useStore(s => s.filter);
  const todos = useStore(s => s.todos);
  const remaining = todos.filter(t => !t.completed).length;
  const anyCompleted = todos.some(t => t.completed);
  const setFilter = (f: Filter) => store.setFilter(f);
  return (
    <div className="toolbar" role="toolbar" aria-label="Filtering options">
      {(['all','active','completed'] as Filter[]).map(f => (
        <button key={f} className="filter-btn" data-active={filter===f} onClick={() => setFilter(f)}>
          {f} {f==='active' && `(${remaining})`}
        </button>
      ))}
      {anyCompleted && (
        <button className="filter-btn" onClick={() => store.clearCompleted()} title="Clear completed">
          Clear Done
        </button>
      )}
    </div>
  );
};

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const commit = () => {
    if (!value.trim()) return setValue(todo.title);
    store.update(todo.id, value);
    setEditing(false);
  };
  return (
    <li className="todo-item" data-completed={todo.completed}>
      <input type="checkbox" checked={todo.completed} onChange={() => store.toggle(todo.id)} aria-label="Toggle completion" />
      {editing ? (
        <input className="inline-edit-input" value={value} onChange={e=>setValue(e.target.value)} onBlur={commit} onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape'){ setValue(todo.title); setEditing(false);} }} autoFocus />
      ) : (
        <div className="title" onDoubleClick={()=>setEditing(true)}>{todo.title}</div>
      )}
      <div style={{ display:'flex', gap:'.45rem' }}>
        <button className="icon-btn" onClick={()=>setEditing(v=>!v)} title="Edit">✏️</button>
        <button className="icon-btn danger" onClick={()=>store.remove(todo.id)} title="Delete">🗑️</button>
      </div>
    </li>
  );
};

export const TodoList: React.FC = () => {
  const { todos, filter } = useStore(s => s);
  const filtered = todos.filter(t => filter==='all' || (filter==='active' ? !t.completed : t.completed));
  if (!filtered.length) return <div className="empty-state" aria-live="polite">No tasks {todos.length? 'match this filter.' : 'yet. Add one!'}</div>;
  return (
    <ul className="todo-list" aria-live="polite">
      {filtered.map(t => <TodoItem key={t.id} todo={t} />)}
    </ul>
  );
};

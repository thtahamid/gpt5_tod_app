import { Todo, Filter } from './types';

// Simple in-memory store (ephemeral). Could be swapped for persistent storage.
export type TodoState = {
  todos: Todo[];
  filter: Filter;
};

type Listener = () => void;

class Store {
  private state: TodoState = { todos: [], filter: 'all' };
  private listeners: Set<Listener> = new Set();
  private storageKey = 'todo-app-state-v1';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<TodoState>;
          this.state = { ...this.state, ...parsed, todos: parsed.todos?.map(t => ({ ...t })) || [] };
        }
      } catch {
        // ignore corrupted storage
      }
    }
  }

  subscribe(fn: Listener) {
  this.listeners.add(fn);
  return () => { this.listeners.delete(fn); };
  }

  getState(): TodoState {
    return this.state;
  }

  private set(partial: Partial<TodoState>) {
    this.state = { ...this.state, ...partial };
    this.emit();
    if (typeof window !== 'undefined') {
      try { window.localStorage.setItem(this.storageKey, JSON.stringify(this.state)); } catch { /* quota ignore */ }
    }
  }

  private emit() {
    for (const l of this.listeners) l();
  }

  addTodo(title: string) {
    const now = Date.now();
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    this.set({ todos: [todo, ...this.state.todos] });
  }

  toggle(id: string) {
    this.set({
      todos: this.state.todos.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t)
    });
  }

  remove(id: string) {
    this.set({ todos: this.state.todos.filter(t => t.id !== id) });
  }

  update(id: string, title: string) {
    this.set({ todos: this.state.todos.map(t => t.id === id ? { ...t, title: title.trim(), updatedAt: Date.now() } : t) });
  }

  clearCompleted() {
    this.set({ todos: this.state.todos.filter(t => !t.completed) });
  }

  setFilter(filter: Filter) { this.set({ filter }); }
}

export const store = new Store();

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

export type Filter = 'all' | 'active' | 'completed';

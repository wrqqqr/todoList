// src/store/useTodoStore.ts
import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoState {
    todoList: Todo[];
    completedList: Todo[];
    newTodo: string;
    searchText: string;
    setNewTodo: (text: string) => void;
    setSearchText: (text: string) => void;
    addTodo: () => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    editTodo: (id: string, newText: string) => void;
    setTodoList: (todos: Todo[]) => void;
    setCompletedList: (todos: Todo[]) => void;
}

type MyPersist = (
    config: StateCreator<TodoState>,
    options: PersistOptions<TodoState>
) => StateCreator<TodoState>;

const useTodoStore = create<TodoState>(
    (persist as MyPersist)(
        (set) => ({
            todoList: [],
            completedList: [],
            newTodo: '',
            searchText: '',
            setNewTodo: (text: string) => set({ newTodo: text }),
            setSearchText: (text: string) => set({ searchText: text }),
            addTodo: () => set((state) => {
                if (state.newTodo.trim() === '') return state;
                const newTodo: Todo = { id: uuidv4(), text: state.newTodo, completed: false };
                return { todoList: [...state.todoList, newTodo], newTodo: '' };
            }),
            toggleTodo: (id: string) => set((state) => ({
                todoList: state.todoList.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ),
            })),
            deleteTodo: (id: string) => set((state) => ({
                todoList: state.todoList.filter(todo => todo.id !== id),
            })),
            editTodo: (id: string, newText: string) => set((state) => ({
                todoList: state.todoList.map(todo =>
                    todo.id === id ? { ...todo, text: newText } : todo
                ),
            })),
            setTodoList: (todos: Todo[]) => set({ todoList: todos }),
            setCompletedList: (todos: Todo[]) => set({ completedList: todos }),
        }),
        { name: 'todo-storage' }
    )
);

export { useTodoStore };

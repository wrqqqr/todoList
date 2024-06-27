import React, { useState } from 'react';
import { Container, List, TextField, Button, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from "../TodoItem/TodoItem.tsx";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (newTodo.trim() === '') return;
        setTodoList([...todoList, { id: uuidv4(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const handleToggleTodo = (id: string) => {
        setTodoList(todoList.map(Todo => Todo.id === id ? { ...Todo, completed: !Todo.completed } : Todo));
    };

    const handleDeleteTodo = (id: string) => {
        setTodoList(todoList.filter(Todo => Todo.id !== id));
    };

    const handleEditTodo = (id: string, newText: string) => {
        setTodoList(todoList.map(Todo => Todo.id === id ? { ...Todo, text: newText } : Todo));
    };

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(todoList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTodoList(items);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Todo List
            </Typography>
            <TextField
                label="New Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                fullWidth
            />
            <Button onClick={handleAddTodo} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Add
            </Button>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="TodoList">
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            {todoList.map((Todo, index) => (
                                <Draggable key={Todo.id} draggableId={Todo.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TodoItem
                                                id={Todo.id}
                                                text={Todo.text}
                                                completed={Todo.completed}
                                                onToggle={handleToggleTodo}
                                                onDelete={handleDeleteTodo}
                                                onEdit={handleEditTodo}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Container>
    );
};

export default TodoList;

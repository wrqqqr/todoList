// src/components/TodoList.tsx
import React, { useState } from 'react';
import { Container, List, TextField, Button, Typography, Box } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem.tsx';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [completedList, setCompletedList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        if (newTodo.trim() === '') return;
        setTodoList([...todoList, { id: uuidv4(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const handleToggleTodo = (id: string) => {
        setTodoList(todoList.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const handleDeleteTodo = (id: string) => {
        setTodoList(todoList.filter(todo => todo.id !== id));
    };

    const handleEditTodo = (id: string, newText: string) => {
        setTodoList(todoList.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    };

    const handleOnDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        let sourceList = source.droppableId === 'activeTodoList' ? [...todoList] : [...completedList];
        let destinationList = destination.droppableId === 'activeTodoList' ? [...todoList] : [...completedList];

        const [movedItem] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, movedItem);

        if (source.droppableId === 'activeTodoList' && destination.droppableId === 'completedTodoList') {
            movedItem.completed = true;
            setTodoList(sourceList);
            setCompletedList(destinationList);
        } else if (source.droppableId === 'completedTodoList' && destination.droppableId === 'activeTodoList') {
            movedItem.completed = false;
            setCompletedList(sourceList);
            setTodoList(destinationList);
        } else {
            if (source.droppableId === 'activeTodoList') {
                setTodoList(destinationList);
            } else {
                setCompletedList(destinationList);
            }
        }
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
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Droppable droppableId="activeTodoList">
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'lightgrey', padding: '10px', borderRadius: '4px', width: '500px' }}>
                                <Typography variant="h6">Active Tasks</Typography>
                                {todoList.map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TodoItem
                                                    id={todo.id}
                                                    text={todo.text}
                                                    completed={todo.completed}
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
                    <Droppable droppableId="completedTodoList">
                        {(provided) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'lightgreen', padding: '10px', borderRadius: '4px', width: '500px' }}>
                                <Typography variant="h6">Completed Tasks</Typography>
                                {completedList.map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TodoItem
                                                    id={todo.id}
                                                    text={todo.text}
                                                    completed={todo.completed}
                                                    onToggle={handleToggleTodo}
                                                    onDelete={handleDeleteTodo}
                                                    onEdit={handleEditTodo}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </Box>
            </DragDropContext>
        </Container>
    );
};

export default TodoList;

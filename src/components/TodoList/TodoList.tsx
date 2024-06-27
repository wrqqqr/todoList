// src/components/TodoList.tsx
import React from 'react';
import { Container, List, TextField, Button, Typography, Box } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem.tsx';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTodoStore } from '../../store/useTodoStore';

const TodoList: React.FC = () => {
    const {
        todoList,
        completedList,
        newTodo,
        searchText,
        setNewTodo,
        setSearchText,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        setTodoList,
        setCompletedList
    } = useTodoStore();

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

    const filteredTodoList = todoList.filter(todo =>
        todo.text.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredCompletedList = completedList.filter(todo =>
        todo.text.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Todo List
            </Typography>
            <TextField
                label="New Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                fullWidth
            />
            <Button onClick={addTodo} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Add
            </Button>
            <TextField
                label="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                fullWidth
                style={{ marginTop: '20px' }}
            />
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Droppable droppableId="activeTodoList">
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'lightgrey', padding: '10px', borderRadius: '4px', width: '500px' }}>
                                <Typography variant="h6">Active Tasks</Typography>
                                {filteredTodoList.map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TodoItem
                                                    id={todo.id}
                                                    text={todo.text}
                                                    completed={todo.completed}
                                                    onToggle={toggleTodo}
                                                    onDelete={deleteTodo}
                                                    onEdit={editTodo}
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
                        {(provided: any) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef} style={{ backgroundColor: 'lightgreen', padding: '10px', borderRadius: '4px', width: '500px' }}>
                                <Typography variant="h6">Completed Tasks</Typography>
                                {filteredCompletedList.map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TodoItem
                                                    id={todo.id}
                                                    text={todo.text}
                                                    completed={todo.completed}
                                                    onToggle={toggleTodo}
                                                    onDelete={deleteTodo}
                                                    onEdit={editTodo}
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

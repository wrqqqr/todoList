import React, { useState } from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

interface ToDoItemProps {
    id: string;
    text: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({ id, text, completed, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedText(e.target.value);
    };

    const handleSave = () => {
        onEdit(id, editedText);
        setIsEditing(false);
    };

    return (
        <ListItem style={{border: '1px solid grey'}}>
            <Checkbox checked={completed} onChange={() => onToggle(id)} />
            {isEditing ? (
                <TextField value={editedText} onChange={handleEditChange} onBlur={handleSave} autoFocus />
            ) : (
                <ListItemText primary={text} style={{ textDecoration: completed ? 'line-through' : 'none' }} />
            )}
            <IconButton onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
            <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
};

export default ToDoItem;

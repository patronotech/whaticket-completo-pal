import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function ContactNotesEditModal({ open, onClose, note, onSave }) {
  const [editedNote, setEditedNote] = useState(note);

  const handleSave = () => {
    onSave(editedNote); // Chama a função onSave com a nota editada
    onClose(); // Fecha o diálogo de edição
  };

  return (
    <Dialog open={open} onClose={onClose} 
    maxWidth="xs"
    fullWidth
    >
      <DialogTitle>Edit Note</DialogTitle>
      <DialogContent>
        <TextField
          label="Edit Note"
          fullWidth
          multiline
          rows={4}
          value={note}
          onChange={(e) => setEditedNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

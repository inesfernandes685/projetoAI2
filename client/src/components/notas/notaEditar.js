import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';

const EditarNota = ({ open, onClose, nota, onSave, onNotaChange}) => {
    const [notaEditada, setNotaEditada] = useState({ ...nota });

    useEffect(() => {
        if (nota) {
            setNotaEditada({ ...nota });
        }
    }, [nota]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onNotaChange();
        setNotaEditada(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : (value === 'Nenhuma' ? null : value)
        }));
    };

    const handleSave = () => {
        onSave(notaEditada);
        onClose();
        onNotaChange(notaEditada);
    };

    const formatDateForInput = (date) => {
        if (!date) return ''; 
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Editar Nota</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="titulo"
                    label="Título"
                    type="text"
                    fullWidth
                    value={notaEditada.titulo || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="descricao"
                    label="Descrição"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    value={notaEditada.descricao || ''}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Prioridade</InputLabel>
                    <Select
                        name="prioridade"
                        value={notaEditada.prioridade ?? 'Nenhuma'}
                        onChange={handleChange}
                    >
                        <MenuItem value="Nenhuma">Nenhuma</MenuItem>
                        <MenuItem value="Casual">Casual</MenuItem>
                        <MenuItem value="Importante">Importante</MenuItem>
                        <MenuItem value="Urgente">Urgente</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    name="data"
                    label="Data"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Selecione uma data"
                    value={formatDateForInput(notaEditada.data)}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="estado"
                            checked={notaEditada.estado}
                            onChange={handleChange}
                            color="primary"
                        />
                    }
                    label="Marcar como concluído"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditarNota;

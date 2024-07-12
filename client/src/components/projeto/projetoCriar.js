import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CriarProjeto = ({ open, onClose, onSave }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSave = () => {
        if (nome.trim() && descricao.trim()) {
            onSave({ nome, descricao });
            setNome('');
            setDescricao('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adicionar Projeto</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome"
                    type="text"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Descrição"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
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

export default CriarProjeto;

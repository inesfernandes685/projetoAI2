import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, IconButton, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/api';
import CloseIcon from '@mui/icons-material/Close';

const EditarProjeto = ({ projeto, utilizadores, atualizarUtilizadores, open, onClose, onSave }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (projeto) {
            setNome(projeto.nome || '');
            setDescricao(projeto.descricao || '');
            atualizarUtilizadores(projeto.id);
        }
    }, [projeto, atualizarUtilizadores]);

    // Encontra o criador do projeto pelos utilizadores associados
    const criador = utilizadores.find(utilizador => utilizador?.Utilizador?.id === projeto?.idCriador);

    // Filtra os colaboradores removendo o criador do array
    const colaboradores = utilizadores.filter(utilizador => utilizador?.Utilizador?.id !== projeto?.idCriador);

    const handleUtilizadorRemover = async (idUtilizador) => {
        try {
            console.log(idUtilizador, projeto.id)
            await api.delete(`/projetos/${projeto.id}/utilizadores/${idUtilizador}`);
            atualizarUtilizadores(projeto.id); 
        } catch (error) {
            console.error('Erro ao remover utilizador do projeto:', error);
        }
    };

    const handleSave = async () => {
        const projetoAtualizado = {
            ...projeto,
            nome,
            descricao,
            colaboradores: colaboradores.map(colaborador => colaborador.id)
        };

        try {
            await api.put(`/projetos/${projeto.id}`, projetoAtualizado);
            onSave(projetoAtualizado); // Chama a função onSave com o projeto atualizado
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Editar Projeto
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1">Nome do Projeto</Typography>
                    <TextField
                        fullWidth
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        variant="outlined"
                        margin="dense"
                    />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1">Descrição</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        variant="outlined"
                        margin="dense"
                    />
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="subtitle1">Utilizadores Associados</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="utilizadores table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome do Criador</TableCell>
                                    <TableCell>Username</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {criador && (
                                    <TableRow key={criador?.Utilizador?.id}>
                                        <TableCell component="th" scope="row">
                                            {criador?.Utilizador?.nome}
                                        </TableCell>
                                        <TableCell>{criador?.Utilizador?.username || 'Não definido'}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={2}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="utilizadores table">
                        {/* Tabela para os colaboradores */}
                        <TableHead>
                            <TableRow>
                            <TableCell>Nome dos Colaboradores</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {colaboradores.length > 0 ? (
                            colaboradores.map(colaborador => (
                                <TableRow key={colaborador?.Utilizador?.id}>
                                <TableCell component="th" scope="row">
                                    {colaborador?.Utilizador?.nome}
                                </TableCell>
                                <TableCell>{colaborador?.Utilizador?.username || 'Não definido'}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleUtilizadorRemover(colaborador?.Utilizador?.id)} size="small">
                                    <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan="3" align="center">Não existem colaboradores</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Guardar
                </Button>
                <Button onClick={onClose} variant="outlined" color="primary">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditarProjeto;

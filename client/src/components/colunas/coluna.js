import React, { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotaCard from '../notas/notaCard';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import api from '../api/api';

const Coluna = ({ coluna, projetoId, provided, notas, onColunaChange, onNotaChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [novaNotaDialogOpen, setNovaNotaDialogOpen] = useState(false);
    const [novoNomeColuna, setNovoNomeColuna] = useState(coluna.nome);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [errors, setErrors] = useState({});

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleEditColumn = async () => {
        try {
            await api.put(`/colunas/${coluna.id}`, { nome: novoNomeColuna });
            handleDialogClose();
            onColunaChange();
        } catch (error) {
            console.error('Erro ao editar coluna:', error);
        }
    };

    const handleDeleteColumn = async () => {
        Swal.fire({
            title: 'Apagar coluna?',
            text: 'Todas as notas nela serão apagadas!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#008B98',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, apagar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/colunas/${coluna.id}`);
                    Swal.fire('Apagado!', 'A sua coluna foi apagada.', 'success');
                    onColunaChange();
                } catch (error) {
                    console.error('Erro ao apagar coluna:', error);
                }
            }
        });
        handleMenuClose();
    };

    const handleNovaNotaDialogOpen = () => {
        setNovaNotaDialogOpen(true);
    };

    const handleFecharNovaNotaDialog = () => {
        setNovaNotaDialogOpen(false);
        setTitulo('');
        setDescricao('');
        setData('');
        setErrors({});
    };

    const schema = yup.object().shape({
        titulo: yup.string().required('O título é obrigatório'),
        data: yup.date()
            .nullable()
            .transform((value, originalValue) => originalValue === "" ? null : value)
            .min(new Date(), 'A data não pode estar no passado')
    });

    const handleAdicionarNota = async () => {
        try {
            const dataParaEnviar = data ? data : null;
    
            await schema.validate({ titulo, descricao, data: dataParaEnviar }, { abortEarly: false });
            await api.post('/notas', {
                titulo,
                descricao,
                data: dataParaEnviar,
                idColuna: coluna.id,
                idProjeto: projetoId
            });
            handleFecharNovaNotaDialog();
            onNotaChange();
        } catch (err) {
            if (err.inner) {
                const errorMessages = err.inner.reduce((acc, currentError) => {
                    acc[currentError.path] = currentError.message;
                    return acc;
                }, {});
                setErrors(errorMessages);
            } else {
                console.error('Erro ao criar nota:', err);
            }
        }
    };

    return (
        <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
                backgroundColor: '#f0f0f0',
                borderRadius: 2,
                width: 300,
                padding: 2,
                minHeight: '700px',
                maxHeight: '100vh',
                alignItems: 'center',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ marginBottom: 1, fontWeight: '500', margin: 'auto' }}>{coluna.nome}</Typography>
                <IconButton onClick={handleMenuOpen} sx={{mr: -2}}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleDialogOpen}>Editar</MenuItem>
                    <MenuItem onClick={handleDeleteColumn}>Apagar</MenuItem>
                </Menu>
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Editar Coluna</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insira o novo nome da coluna.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nome da Coluna"
                            type="text"
                            fullWidth
                            value={novoNomeColuna}
                            onChange={(e) => setNovoNomeColuna(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handleEditColumn}>Salvar</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {notas.map((nota, index) => (
                <NotaCard
                    key={nota.id}
                    nota={nota}
                    index={index}
                    onNotaChange={onNotaChange}
                />
            ))}
            {provided.placeholder}
            <Box
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 2,
                    padding: 2,
                    marginTop: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
                onClick={handleNovaNotaDialogOpen}
            >
                <Typography variant="body2" color="textSecondary">Adicionar Nota</Typography>
            </Box>
            <Dialog open={novaNotaDialogOpen} onClose={handleFecharNovaNotaDialog}>
                <DialogTitle>Adicionar Nota</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insira os detalhes da nova nota.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título da Nota"
                        type="text"
                        fullWidth
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        error={Boolean(errors.titulo)}
                        helperText={errors.titulo}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição da Nota"
                        type="text"
                        fullWidth
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        error={Boolean(errors.descricao)}
                        helperText={errors.descricao}
                    />
                    <TextField
                        margin="dense"
                        label="Data da Nota"
                        type="date"
                        fullWidth
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={Boolean(errors.data)}
                        helperText={errors.data}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharNovaNotaDialog}>Cancelar</Button>
                    <Button onClick={handleAdicionarNota}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Coluna;

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, IconButton, Avatar, AvatarGroup, Tooltip, List, ListItem, ListItemText, Paper } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Coluna from '../colunas/coluna';
import EditarProjeto from './projetoEditar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete'; // Importe o ícone de Delete
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Projeto = () => {
    const { projetoId } = useParams();
    const [projetoSelecionado, setProjetoSelecionado] = useState(null);
    const [colunas, setColunas] = useState([]);
    const [notas, setNotas] = useState([]);
    const [utilizadores, setUtilizadores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [novaColunaNome, setNovaColunaNome] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const [dialogProjetosOpen, setDialogProjetosOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjetos();
    }, []);

    useEffect(() => {
        if (projetoId) {
            handleProjetoChange(projetoId);
        }
    }, [projetoId]);

    const fetchProjetos = async () => {
        try {
            const response = await api.get('/projetos');
            setProjetos(response.data);
            if (response.data.length > 0 && !projetoId) {
                navigate(`/projetos/${response.data[0].id}`);
            }
        } catch (error) {
            console.error('Erro ao encontrar projetos:', error);
        }
    };

    const fetchColunas = useCallback(async (idProjeto) => {
        if (!idProjeto) return;

        try {
            const response = await api.get(`/colunas/${idProjeto}`);
            setColunas(response.data.colunas);
        } catch (error) {
            console.error('Erro ao buscar colunas:', error);
        }
    }, []);

    const fetchNotas = useCallback(async (idProjeto) => {
        if (!idProjeto) return;

        try {
            const response = await api.get(`/notas/projeto/${idProjeto}`);
            setNotas(response.data);
        } catch (error) {
            console.error('Erro ao buscar notas:', error);
        }
    }, []);

    const fetchUtilizadores = useCallback(async (idProjeto) => {
        if (!idProjeto) return;

        try {
            const response = await api.get(`/projetos/${idProjeto}/utilizadores`);
            setUtilizadores(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
        }
    }, []);

    const onDragEnd = useCallback(async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const notaArrastada = notas.find(n => n.id.toString() === draggableId);
        notaArrastada.idColuna = destination.droppableId;

        const newNotas = notas.map(n => (n.id.toString() === draggableId ? notaArrastada : n));
        setNotas(newNotas);

        try {
            await api.put(`/notas/${notaArrastada.id}`, { idColuna: notaArrastada.idColuna });
            fetchNotas(projetoId);
        } catch (error) {
            console.error('Erro ao atualizar nota:', error);
        }
    }, [notas, fetchNotas, projetoId]);

    const handleAddColuna = async () => {
        if (!novaColunaNome.trim()) {
            return;
        }

        try {
            const response = await api.post('/colunas', {
                nome: novaColunaNome.trim(),
                idProjeto: projetoId
            });
            setColunas([...colunas, response.data]);
            setDialogOpen(false);
            setNovaColunaNome('');
        } catch (error) {
            console.error('Erro ao criar coluna:', error);
        }
    };

    const handleOpenEditDialog = () => {
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
    };

    const handleSaveEditDialog = async (projetoAtualizado) => {
        try {
            await api.put(`/projetos/${projetoAtualizado.id}`, projetoAtualizado);
            // Atualiza o projeto selecionado
            setProjetoSelecionado(projetoAtualizado);
            fetchColunas(projetoAtualizado.id);
            fetchNotas(projetoAtualizado.id);
            fetchUtilizadores(projetoAtualizado.id);
        } catch (error) {
            console.error('Erro ao salvar projeto atualizado:', error);
        } finally {
            handleCloseEditDialog();
        }
    };

    const handleProjetoChange = async (idProjeto) => {
        try {
            const responseProjeto = await api.get(`/projetos/${idProjeto}`);
            setProjetoSelecionado(responseProjeto.data);
            fetchColunas(idProjeto);
            fetchNotas(idProjeto);
            fetchUtilizadores(idProjeto);
        } catch (error) {
            console.error('Erro ao selecionar projeto:', error);
        }
    };

    const handleApagarProjeto = async () => {
        // Mostrar o alerta de confirmação
        const result = await Swal.fire({
          title: 'Tem a certeza que quer apagar o projeto?',
          text: 'Esta ação é irreversível!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#008B98',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Sim, apagar projeto',
          cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
          try {
            await api.delete(`/projetos/${projetoId}`);
            Swal.fire({
                title: 'Projeto Apagado!',
                text: 'O projeto foi apagado com sucesso.',
                icon: 'success',
                confirmButtonColor: '#008B98'
              });
            navigate('/');
          } catch (error) {
            console.error('Erro ao apagar o projeto:', error);
            Swal.fire('Erro', 'Ocorreu um erro ao apagar o projeto.', 'error');
          }
        }
      };

    const renderProjectName = () => {
        if (!projetoSelecionado) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ cursor: 'pointer', color: 'primary' }} onClick={toggleDropdown}>
                        Selecione um projeto
                    </Typography>
                    <IconButton onClick={toggleDropdown}>
                        <ArrowDropDownIcon />
                    </IconButton>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openDialogProjetos}
                        size="large"
                        sx={{ fontSize: '1.1rem' }}
                    >
                        {projetoSelecionado.nome}
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                    {utilizadores.length > 0 && (
                        <AvatarGroup max={3}>
                            {utilizadores.map((utilizador) => (
                                <Tooltip key={utilizador.Utilizador.id} title={utilizador.Utilizador.nome}>
                                    <Avatar alt={utilizador.Utilizador.nome} src={process.env.REACT_APP_API_URL + '/uploads/' + utilizador.Utilizador.foto} />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    )}
                    <Tooltip title="Partilhar Projeto">
                        <IconButton onClick={handleShareProject} sx={{ }}> 
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar Projeto">
                        <IconButton onClick={handleApagarProjeto} sx={{ }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Definições do Projeto">
                        <IconButton onClick={handleOpenEditDialog} sx={{ mr: 2}}>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Dialog open={dialogProjetosOpen} onClose={closeDialogProjetos}>
                        <DialogTitle>Selecione um Projeto</DialogTitle>
                        <DialogContent>
                            <List>
                                {projetos.map(projeto => (
                                    <ListItem
                                        button
                                        key={projeto.id}
                                        onClick={() => {
                                            handleSelectProjeto(projeto.id);
                                            closeDialogProjetos();
                                        }}
                                    >
                                        <ListItemText primary={projeto.nome} />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDialogProjetos} color="primary">
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {dropdownOpen && (
                        <Paper sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 1 }}>
                            <List>
                                {projetos.map(projeto => (
                                    <ListItem
                                        button
                                        key={projeto.id}
                                        onClick={() => handleSelectProjeto(projeto.id)}
                                    >
                                        <ListItemText primary={projeto.nome} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </Box>
        );
    };

    const handleSelectProjeto = (idProjeto) => {
        navigate(`/projetos/${idProjeto}`);
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openDialogProjetos = () => {
        setDialogProjetosOpen(true);
    };

    const closeDialogProjetos = () => {
        setDialogProjetosOpen(false);
    };

    const handleShareProject = async () => {
        try {
            const response = await api.get(`/projetos/partilhar/${projetoSelecionado.id}`);
            const linkPartilha = response.data;

            // Copiar para a área de transferência
            navigator.clipboard.writeText(linkPartilha);

            // Utiliza toast do react-toastify para notificação
            toast.success('Link copiado para a área de transferência', {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Erro ao gerar link de compartilhamento:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                {renderProjectName()}
            </Box>
            {projetoSelecionado && (
                <>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            {colunas.map((coluna, index) => (
                                <Droppable key={coluna.id.toString()} droppableId={coluna.id.toString()}>
                                    {(provided, snapshot) => (
                                        <Coluna
                                            key={coluna.id}
                                            coluna={coluna}
                                            projetoId={projetoSelecionado.id}
                                            provided={provided}
                                            notas={notas.filter(n => n.idColuna === coluna.id)}
                                            onColunaChange={() => fetchColunas(projetoId)}
                                            onNotaChange={() => fetchNotas(projetoId)}
                                        />
                                    )}
                                </Droppable>
                            ))}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button variant="contained" onClick={() => setDialogOpen(true)}>+</Button>
                            </Box>
                        </Box>
                    </DragDropContext>
                    <EditarProjeto
                        projeto={projetoSelecionado}
                        utilizadores={utilizadores}
                        atualizarUtilizadores={fetchUtilizadores}
                        open={editDialogOpen}
                        onClose={handleCloseEditDialog}
                        onSave={handleSaveEditDialog}
                    />
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                        <DialogTitle>Adicionar Coluna</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Insira o nome da nova coluna.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nome da Coluna"
                                type="text"
                                fullWidth
                                value={novaColunaNome}
                                onChange={(e) => setNovaColunaNome(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={handleAddColuna} color="primary">
                                Confirmar
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <ToastContainer />
                </>
            )}
            {!projetoSelecionado && (
                <Typography variant="body1">Selecione um projeto</Typography>
            )}
        </Box>
    );
};

export default Projeto;

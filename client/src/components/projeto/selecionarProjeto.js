import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Paper, ClickAwayListener } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import Projeto from './projeto';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CriarProjeto from './projetoCriar';

const SelecionarProjeto = () => {
    const [projetos, setProjetos] = useState([]);
    const [utilizador, setUtilizador] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dialogProjetoOpen, setDialogProjetoOpen] = useState(false); // State for creating project dialog
    const navigate = useNavigate();
    const { projetoId } = useParams();

    useEffect(() => {
        fetchProjetos();
        fetchUtilizador();
    }, []);

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

    const fetchUtilizador = async () => {
        try {
            const response = await api.get('/utilizador-completo');
            setUtilizador(response.data);
        } catch (error) {
            console.error('Erro ao encontrar utilizador:', error);
        }
    };

    const handleProjetoChange = (id) => {
        navigate(`/projetos/${id}`);
        setDropdownOpen(false); // Fecha o dropdown ao selecionar um projeto
    };

    const handleSaveProjeto = async (novoProjeto) => {
        try {
            const response = await api.post('/projetos', novoProjeto);
            setProjetos([...projetos, response.data]);
            navigate(`/projetos/${response.data.id}`);
            setDialogProjetoOpen(false);
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen); // Alterna entre abrir e fechar o dropdown
    };

    const handleClickAway = () => {
        setDropdownOpen(false); // Fecha o dropdown ao clicar fora dele
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, position: 'relative' }}>
                    <Typography variant="h4" sx={{ cursor: 'pointer' }} onClick={toggleDropdown}>
                        {projetos.find(proj => proj.id === Number(projetoId))?.nome || 'Selecione um projeto'}
                    </Typography>
                    <IconButton onClick={toggleDropdown}>
                        <ArrowDropDownIcon />
                    </IconButton>
                    <Fab size="small" color="primary" aria-label="add" onClick={() => setDialogProjetoOpen(true)}>
                        <AddIcon />
                    </Fab>
                    {dropdownOpen && (
                        <Paper sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 1 }}>
                            <List>
                                {projetos.map(projeto => (
                                    <ListItem button key={projeto.id} onClick={() => handleProjetoChange(projeto.id)}>
                                        <ListItemText primary={projeto.nome} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
                {projetoId && (
                    <Projeto idProjeto={projetoId} />
                )}
                <CriarProjeto
                    open={dialogProjetoOpen}
                    onClose={() => setDialogProjetoOpen(false)}
                    onSave={handleSaveProjeto}
                />
            </Box>
        </ClickAwayListener>
    );
};

export default SelecionarProjeto;

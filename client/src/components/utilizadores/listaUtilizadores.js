import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as RouterLink,  
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/api';

const ListaUtilizadores = () => {
  const [utilizadores, setUtilizadores] = useState([]);
  const [open, setOpen] = useState(false);
  const [utilizador, setUtilizador] = useState({ id: '', nome: '', email: '', estado: false, isAdmin: false });
  const [isEdit, setIsEdit] = useState(false);

  const [projetosUtilizador, setProjetosUtilizador] = useState([]);
  const [openProjetosDialog, setOpenProjetosDialog] = useState(false);

  useEffect(() => {
    fetchUtilizadores();
  }, []);

  const fetchUtilizadores = async () => {
    try {
      const response = await api.get('/utilizadores');
      setUtilizadores(response.data);
    } catch (error) {
      console.error('Erro ao procurar utilizadores:', error);
    }
  };

  const fetchProjetosUtilizador = async (idUtilizador) => {
    try {
      const response = await api.get(`/projetos/${idUtilizador}/projetos`); 
      setProjetosUtilizador(response.data);
      setOpenProjetosDialog(true); 
    } catch (error) {
      console.error('Erro ao procurar projetos do utilizador:', error);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (isEdit) {
        await api.put(`/utilizadores/${utilizador.id}`, utilizador);
      } else {
        await api.post('/utilizadores', utilizador);
      }
      fetchUtilizadores();
      setOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar/editar utilizador:', error);
    }
  };

  const handleClickOpen = (user = null) => {
    if (user) {
      setUtilizador(user);
      setIsEdit(true);
    } else {
      setUtilizador({ id: '', nome: '', email: '', estado: false, isAdmin: false });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseProjetosDialog = () => {
    setOpenProjetosDialog(false);
    setProjetosUtilizador([]);
  };

  const handleVerProjetos = (idUtilizador, nomeUtilizador) => {
    fetchProjetosUtilizador(idUtilizador);
    setUtilizadorNome(nomeUtilizador);
  };

  const [utilizadorNome, setUtilizadorNome] = useState('');

  return (
    <div style={{ width: '98%' }}>
      <Typography variant="h4" component="h1" sx={{mt: 2}} gutterBottom>
         Gerir Utilizadores
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Adicionar Utilizador
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table aria-label="Lista de Utilizadores">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilizadores.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleVerProjetos(user.id, user.nome)}>
                    {user.nome}
                  </Button>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.estado ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>{user.isAdmin ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleClickOpen(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Editar Utilizador' : 'Adicionar Utilizador'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            value={utilizador.nome}
            onChange={(e) => setUtilizador({ ...utilizador, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={utilizador.email}
            onChange={(e) => setUtilizador({ ...utilizador, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              value={utilizador.estado}
              onChange={(e) => setUtilizador({ ...utilizador, estado: e.target.value })}
            >
              <MenuItem value={true}>Ativo</MenuItem>
              <MenuItem value={false}>Inativo</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Admin</InputLabel>
            <Select
              value={utilizador.isAdmin}
              onChange={(e) => setUtilizador({ ...utilizador, isAdmin: e.target.value })}
            >
              <MenuItem value={true}>Sim</MenuItem>
              <MenuItem value={false}>Não</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddOrEdit} color="primary">
            {isEdit ? 'Guardar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProjetosDialog} onClose={handleCloseProjetosDialog} fullWidth maxWidth="md">
        <DialogTitle>Projetos de {utilizadorNome}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="Projetos do Utilizador">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome do Projeto</TableCell>
                  <TableCell>Descrição</TableCell>
                  {/* Adicionar mais colunas conforme necessário */}
                </TableRow>
              </TableHead>
              <TableBody>
                {projetosUtilizador.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell>{projeto.id}</TableCell>
                    <TableCell>
                      <RouterLink
                        component="button"
                        variant="body2"
                        onClick={() => {
                          window.location.href = `/projetos/${projeto.id}`;
                        }}
                      >
                        {projeto.nome}
                      </RouterLink>
                    </TableCell>
                    <TableCell>{projeto.descricao}</TableCell>
                    {/* Adicionar mais células conforme necessário */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjetosDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListaUtilizadores;

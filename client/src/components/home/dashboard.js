import React, { useState, useEffect } from 'react';
import DashboardProjetos from './dashboardProjetos';
import DashboardCriar from './dashboardCriar';
import api from '../api/api';
import { Avatar, Typography, Button, Box, Grid } from '@mui/material';
import EditarPerfil from '../utilizadores/editarPerfil';

const DashboardMain = () => {
  const [saudacao, setSaudacao] = useState('');
  const [utilizador, setUtilizador] = useState(null);
  const [openEditarPerfil, setOpenEditarPerfil] = useState(false);

  const url = process.env.REACT_APP_API_URL;

  const handleOpenEditarPerfil = () => {
    fetchUtilizador();
    setOpenEditarPerfil(true);
  };

  const handleCloseEditarPerfil = () => {
    setOpenEditarPerfil(false);
    fetchUtilizador();
  };

  const fetchUtilizador = async (perfilAtualizado = null) => {
    if (perfilAtualizado) {
      setUtilizador(perfilAtualizado);
    } else {
      try {
        const response = await api.get('/utilizador-completo');
        setUtilizador(response.data);
      } catch (error) {
        console.error('Erro ao encontrar utilizador:', error);
      }
    }
  };

  useEffect(() => {
    fetchUtilizador();
  }, []);

  useEffect(() => {
    if (utilizador) {
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 13) {
        setSaudacao('Bom dia, ');
      } else if (currentHour >= 13 && currentHour < 20) {
        setSaudacao('Boa tarde, ');
      } else {
        setSaudacao('Boa noite, ');
      }
    }
  }, [utilizador]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {utilizador && (
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, marginTop: 2 }}>
          <Avatar sx={{ width: 55, height: 55, marginRight: 2 }} alt={utilizador?.nome} src={url + '/uploads/' + utilizador?.foto}/>
          <span>{saudacao} <strong>{utilizador.nome}</strong></span>
          <Button
            variant="contained"
            color="inherit" 
            sx={{ marginLeft: 'auto', marginRight: '32px'}} 
            size='small'
            onClick={handleOpenEditarPerfil} 
          >
            Editar Perfil
          </Button>
          <EditarPerfil open={openEditarPerfil} handleClose={handleCloseEditarPerfil} perfil={utilizador} onUpdate={fetchUtilizador} />
        </Typography>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ height: '83vh', width: '99%' }}>
          <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 0, padding: 0 }}>
            <DashboardCriar sx={{ flexGrow: 1, margin: 0, padding: 0 }} />
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column', padding: 0, minHeight: '40vh'}}>
            <DashboardProjetos sx={{ flexGrow: 1, margin: 0, padding: 0 }} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardMain;

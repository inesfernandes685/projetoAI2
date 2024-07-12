import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';

const DashboardUtilizador = ({ utilizador }) => {
  const handleEditarNome = () => {
    // Lógica para editar o nome do utilizador
    console.log('Editar nome');
  };

  const handleAlterarFoto = () => {
    // Lógica para alterar a foto do utilizador
    console.log('Alterar foto');
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, marginRight: 2 }} alt={utilizador?.nome} src={utilizador?.fotoUrl} />
          <Box>
            <Typography variant="h6">{utilizador?.nome}</Typography>
            <Box sx={{ display: 'flex', marginTop: 1 }}>
              <Button variant="outlined" onClick={handleEditarNome} sx={{ marginRight: 1 }}>
                Editar nome
              </Button>
              <Button variant="outlined" onClick={handleAlterarFoto}>
                Alterar foto
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardUtilizador;

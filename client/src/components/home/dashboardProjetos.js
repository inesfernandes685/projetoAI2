import React, { useState, useEffect } from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import api from '../api/api';

const DashboardProjetos = () => {
  const [projetosUtilizador, setProjetosUtilizador] = useState([]);

  useEffect(() => {
    fetchProjetosUtilizador();
  }, []);

  const fetchProjetosUtilizador = async () => {
    try {
      const response = await api.get(`/projetos`);
      setProjetosUtilizador(response.data);
    } catch (error) {
      console.error('Erro ao buscar projetos do usuário:', error);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Continue o seu trabalho!
        </Typography>
        <TableContainer sx={{ maxHeight: 'calc(80% - 48px)' }}>
          <Table stickyHeader aria-label="Projetos do Usuário">
            <TableHead>
              <TableRow>
                <TableCell>Nome do Projeto</TableCell>
                <TableCell>Descrição</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projetosUtilizador.map((projeto) => (
                <TableRow key={projeto.id}>
                  <TableCell>{projeto.nome}</TableCell>
                  <TableCell>{projeto.descricao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardProjetos;

import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import api from '../api/api';
import Swal from 'sweetalert2';

const DashboardCriar = () => {
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');

  const handleLimparCampos = () => {
    setNomeProjeto('');
    setDescricaoProjeto('');
  };

  const handleCriarProjeto = async () => {
    try {
      // Validar se os campos estão preenchidos
      if (!nomeProjeto || !descricaoProjeto) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, preencha todos os campos!',
        });
        return;
      }

      const response = await api.post('/projetos', { nome: nomeProjeto, descricao: descricaoProjeto });

      // Limpar campos após a criação
      handleLimparCampos();

      // Exibir mensagem de sucesso com SweetAlert
      const novoProjetoId = response.data.id;

      Swal.fire({
        icon: 'success',
        title: 'Projeto criado com sucesso!',
        showCancelButton: false,
        confirmButtonColor: '#008B98', // Define a cor de fundo do botão como #008B98
        confirmButtonText: 'Ir para novo projeto',
      }).then((result) => {
        if (result.isConfirmed) {
          // Navegar para a página do novo projeto
          window.location.href = `/projetos/${novoProjetoId}`;
        }
      });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      // Exibir mensagem de erro com SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Erro ao criar projeto. Por favor, tente novamente!',
      });
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Novo Projeto
        </Typography>
        <TextField
          id="nomeProjeto"
          label="Nome do Projeto"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nomeProjeto}
          onChange={(e) => setNomeProjeto(e.target.value)}
        />
        <TextField
          id="descricaoProjeto"
          label="Descrição"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={descricaoProjeto}
          onChange={(e) => setDescricaoProjeto(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCriarProjeto}>
            Criar
          </Button>
          <Button variant="outlined" color="primary" onClick={handleLimparCampos}>
            Limpar Campos
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCriar;

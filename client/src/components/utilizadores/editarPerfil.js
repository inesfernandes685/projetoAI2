import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Avatar, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/api';
import Swal from 'sweetalert2';

function EditarPerfil({ open, handleClose, perfil, onUpdate }) {
  const [nome, setNome] = useState(perfil.nome);
  const [username, setUsername] = useState(perfil.username);
  const [foto, setFoto] = useState(perfil.foto);
  const [novaFoto, setNovaFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(perfil.foto ? `${process.env.REACT_APP_API_URL}/uploads/${perfil.foto}` : '');
  const [isUploading, setIsUploading] = useState(false);

  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    setNovaFoto(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result); 
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsUploading(true);
    try {
      // Se houver nova foto, envia a foto
      if (novaFoto) {
        const formData = new FormData();
        formData.append('foto', novaFoto);
        const responseFoto = await api.put('/utilizador/foto', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Foto enviada com sucesso:', responseFoto.data);
        setFoto(responseFoto.data); // Atualiza a foto localmente, até guardar as alterações
      }

      if (nome !== perfil.nome || username !== perfil.username) {
        const dadosAtualizados = {
          nome: nome,
          username: username
        };
        const responseDados = await api.put(`/utilizadores/${perfil.id}`, dadosAtualizados);
        console.log('Dados atualizados com sucesso:', responseDados.data);
        onUpdate(responseDados.data); 
      }

      handleClose(); 
    } catch (error) {
      console.error('Erro ao salvar alterações:', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            alt={perfil.nome}
            src={fotoPreview}
            sx={{ width: 100, height: 100, cursor: 'pointer', marginBottom: 2 }}
          />
          <input
            id="foto-input"
            type="file"
            accept="image/*" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
            onChange={handleFotoChange}
          />
        </div>
        <TextField
          id="nome"
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          id="email"
          label="Email"
          value={perfil.email}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isUploading}>
          Cancelar
        </Button>
        <Button onClick={handleSaveChanges} color="primary" disabled={isUploading}>
          Guardar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditarPerfil;

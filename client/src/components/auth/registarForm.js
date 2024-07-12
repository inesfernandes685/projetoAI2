import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/logologin.svg';
import Swal from 'sweetalert2';
import { TextField, Button, Box, Typography } from '@mui/material';

function RegistarForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Estados para controlar se cada requisito de palavra-passe foi cumprido
  const [minLengthValid, setMinLengthValid] = useState(false);
  const [hasNumberValid, setHasNumberValid] = useState(false);
  const [hasUppercaseValid, setHasUppercaseValid] = useState(false);
  const [hasSpecialCharValid, setHasSpecialCharValid] = useState(false);

  const handleRegistar = async () => {
    try {
      const response = await api.post('/criar-conta', {
        nome,
        email,
        password,
        confirmPassword,
      });
  
      if (response.status === 201) {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Conta criada com sucesso, por favor verifique o seu email para a ativar!',
          icon: 'success',
          confirmButtonColor: '#008B98',
          willClose: () => {
            navigate('/login');
          },
        });
      } else if (response.status === 400) {
        const error = response.data.error;
        let errorMessage = '';
  
        if (error.includes('Email já está em uso')) {
          errorMessage = 'Email já está em uso. Por favor, use outro email.';
        } else if (error.includes('Preencha todos os campos')) {
          errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
        } else {
          errorMessage = 'Erro ao registar. Por favor, tente novamente.';
        }
  
        Swal.fire({
          title: 'Erro!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#008B98',
        });
      }
    } catch (error) {
      let errorMessage = 'Erro ao registar. Por favor, tente novamente.';
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
  
      Swal.fire({
        title: 'Erro!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#008B98',
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Erro!',
        text: 'As palavras-passe não coincidem.',
        icon: 'error',
        confirmButtonColor: '#008B98',
      });
      return;
    }
    handleRegistar();
  };

  const validatePassword = (value) => {
    // Verificar se a palavra-passe tem pelo menos 6 caracteres
    if (value.length >= 6) {
      setMinLengthValid(true);
    } else {
      setMinLengthValid(false);
    }

    // Verificar se a palavra-passe contém pelo menos um número
    if (/\d/.test(value)) {
      setHasNumberValid(true);
    } else {
      setHasNumberValid(false);
    }

    // Verificar se a palavra-passe contém pelo menos uma letra maiúscula
    if (/[A-Z]/.test(value)) {
      setHasUppercaseValid(true);
    } else {
      setHasUppercaseValid(false);
    }

    // Verificar se a palavra-passe contém pelo menos um caractere especial
    if (/[!@#$%^&*]/.test(value)) {
      setHasSpecialCharValid(true);
    } else {
      setHasSpecialCharValid(false);
    }

    // Verificar se todos os requisitos são atendidos
    if (value.length >= 6 && /\d/.test(value) && /[A-Z]/.test(value) && /[!@#$%^&*]/.test(value)) {
      setPasswordError('');
    } else {
      setPasswordError('A palavra-passe deve ter pelo menos 6 caracteres, um número, uma letra maiúscula e um caractere especial (!@#$%^&*).');
    }
  };

  return (
    <Box className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '96vh' }}>
      <header className="header mb-1">
        <img src={logo} alt="Logo" className="logo" style={{marginBottom: 30}}/>
      </header>
      <form onSubmit={handleSubmit} className="login-form">
        <TextField
          id="nome"
          name="nome"
          required
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          label="Nome"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          label="Palavra-passe"
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          error={!!passwordError}
          helperText={passwordError}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirme a palavra-passe"
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        />
        {/* Exibição dos requisitos */}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'left', width: '100%' }}>
          Requisitos da palavra-passe:
          <ul>
            <li className={minLengthValid ? 'text-success' : ''}>Pelo menos 6 caracteres</li>
            <li className={hasNumberValid ? 'text-success' : ''}>Pelo menos um número</li>
            <li className={hasUppercaseValid ? 'text-success' : ''}>Pelo menos uma letra maiúscula</li>
            <li className={hasSpecialCharValid ? 'text-success' : ''}>Pelo menos um caracter especial (!@#$%^&*)</li>
          </ul>
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 0, mt: 1, ml: 0}}
        >
          CRIAR CONTA
        </Button>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mb: 2, ml: 0}}
        >
          CANCELAR
        </Button>
      </form>
    </Box>
  );
}

export default RegistarForm;

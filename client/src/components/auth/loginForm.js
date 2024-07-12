import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logologin.svg';
import Swal from 'sweetalert2';
import './login.css';
import api from '../api/api';
import { TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';


function Login({ setIsAuthenticated: setAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (token) {
      setAuth(true);
      navigate('/');
    }
  }, [token, navigate, setAuth]);

  useEffect(() => {
    localStorage.setItem('rememberUser', rememberUser);
  }, [rememberUser]);

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, recoveryToken } = response.data;

      if (rememberUser) {
        localStorage.setItem('token', token);
        if (recoveryToken) {
          localStorage.setItem('recoveryToken', recoveryToken);
        }
      } else {
        sessionStorage.setItem('token', token);
        if (recoveryToken) {
          sessionStorage.setItem('recoveryToken', recoveryToken);
        }
      }

      setToken(token);
      setAuth(true);

      if (recoveryToken) {
        navigate(`/recuperar-passe?token=${recoveryToken}`);
      } else {
          navigate('/');
        }
      
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setIsEmailInvalid(true);
            setIsPasswordInvalid(true);
            setEmailError('Preencha todos os campos.');
            setPasswordError('Preencha todos os campos.');
            break;
          case 401:
            if (data.error === 'Conta não verificada. Verifique o seu email para ativar a sua conta.') {
              Swal.fire({
                title: 'Erro!',
                text: data.error,
                icon: 'error',
                confirmButtonColor: '#008B98',
              });
            } else if (data.error === 'Utilizador não encontrado') {
              setIsEmailInvalid(true);
              setIsPasswordInvalid(false);
              setEmailError(data.error);
              setPasswordError('');
            } else {
              setIsEmailInvalid(false);
              setIsPasswordInvalid(true);
              setEmailError('');
              setPasswordError(data.error || 'Email ou senha incorretos.');
            }
            break;
          case 500:
            setIsEmailInvalid(false);
            setIsPasswordInvalid(false);
            setEmailError('');
            setPasswordError('');
            break;
          default:
            setIsEmailInvalid(false);
            setIsPasswordInvalid(false);
            setEmailError('');
            setPasswordError('');
        }
      } else {
        setIsEmailInvalid(false);
        setIsPasswordInvalid(false);
        setEmailError('');
        setPasswordError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh' }}>
      <header className="header mb-1">
        <img src={logo} alt="Logo" className="logo" style={{marginBottom: 30}} />
      </header>
      <form onSubmit={handleSubmit} className="login-form">
        <TextField
          error={isEmailInvalid}
          helperText={isEmailInvalid ? emailError : ''}
          type="email"
          id="email"
          name="email"
          required
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailInvalid(false);
            setEmailError('');
          }}
          label="Email"
          variant="outlined"
          fullWidth
        />
        <TextField
          error={isPasswordInvalid}
          helperText={isPasswordInvalid ? passwordError : ''}
          type="password"
          id="password"
          name="password"
          autoComplete="off"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsPasswordInvalid(false);
            setPasswordError('');
          }}
          label="Palavra-passe"
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberUser}
              onChange={(e) => setRememberUser(e.target.checked)}
              name="rememberUser"
              color="primary"
            />
          }
          label="Manter sessão iniciada"
        />
        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 0, ml: 0 }} 
            >
            ENTRAR
            </Button>
            <Button
            component={Link}
            to="/registar"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mb: 0, ml: 0 }}
            >
            CRIAR CONTA
            </Button>
            <Box
                sx={{
                    display: 'block', 
                    textAlign: 'center', 
                    fontSize: '0.8rem', 
                    mt: 2, 
                }}
                >
                <Link to="/recuperar-passe" style={{textDecoration:'none', color: 'inherit'}}>
                    Esqueceu a palavra-passe?
                </Link>
                </Box>
                    </form>
                    </div>
            );
}

export default Login;
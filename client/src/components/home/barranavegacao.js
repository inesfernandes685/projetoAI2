import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Avatar,
  Container
} from '@mui/material';
import logo from '../../assets/logosite.svg';
import api from '../api/api';
import Swal from 'sweetalert2';
import { IoIosLogOut } from "react-icons/io";


const BarraNavegacao = () => {
  const [anchorElUtilizador, setAnchorElUtilizador] = useState(null);
  const [utilizador, setUtilizador] = useState({});

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        const response = await api.get('/utilizador-completo');
        setUtilizador(response.data);
      } catch (error) {
        console.error('Erro ao encontrar utilizador:', error);
      }
    };

    fetchUtilizador();

  }, []);

  const handleOpenUtilizadorMenu = (event) => {
    setAnchorElUtilizador(event.currentTarget);
  };

  const handleCloseUtilizadorMenu = () => {
    setAnchorElUtilizador(null);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Pretende terminar a sua sessão?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      confirmButtonColor: '#008B98',
      denyButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('recoveryToken');
        sessionStorage.removeItem('recoveryToken');
        window.location.href = '/login';
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Sessão não terminada',
          icon: 'info',
          confirmButtonColor: '#008B98',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const handleMenuItemClick = (setting) => {
    if (setting === 'Sair') {
      handleLogout();
    } else {
      handleCloseUtilizadorMenu();
    }
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: "primary", boxShadow: 'none' }}>
      <Container maxWidth="xxl">
        <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/">
            <img src={logo} alt="Logo" style={{ marginRight: '30px', width: '150px', height: '64px', objectFit: 'contain' }} />
            </Link>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavLink to="/" exact style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                Início
              </NavLink>
              <NavLink to="/projetos" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                Projetos
              </NavLink>
              <NavLink to="/calendario" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                Calendário
              </NavLink>
              {utilizador.isAdmin && (
                <NavLink to="/utilizadores" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
                  Utilizadores
                </NavLink>
              )}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IoIosLogOut onClick={handleLogout} style={{ color: 'white', cursor: 'pointer', marginLeft: '20px' }} size={25} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default BarraNavegacao;

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/api';

const VerificarEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  console.log(token);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await api.post('/verificar-email', { token });
        Swal.fire({
          title: 'Sucesso!',
          text: response.data.message,
          icon: 'success',
          confirmButtonColor: '#008B98',
        }).then(() => {
          navigate('/login');
        });
      } catch (error) {
        console.error('Erro ao verificar email:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao verificar email. Por favor, tente novamente.',
          icon: 'error',
          confirmButtonColor: '#008B98',
        }).then(() => {
          navigate('/login');
        });
      }
    };

    if (token) verificarToken();
  }, [token, navigate]);

  return null;
};

export default VerificarEmail;

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AceitarConvite = () => {
  const query = useQuery();
  const token = query.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const getProjetoData = async () => {
      try {
        const response = await api.get(`/projetos/dados?token=${token}`);
        const projeto = response.data;

        Swal.fire({
          title: `Foi convidado para o projeto: "${projeto.nome}"`,
          text: `Deseja juntar-se?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Aceitar',
          confirmButtonColor: '#008B98',
          cancelButtonText: 'Recusar',
          cancelButtonColor: '#6c757d',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const acceptResponse = await api.post('/projetos/aceitar', { token });
              Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: acceptResponse.data,
                confirmButtonColor: '#008B98',
              });
              navigate(`/projetos/${projeto.id}`);
            } catch (acceptError) {
              console.error('Erro ao aceitar convite:', acceptError);
              const errorMessage = acceptError.response?.data || 'Erro ao aceitar convite. Tente novamente mais tarde.';
              Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: errorMessage,
                confirmButtonColor: '#008B98',
              });
              navigate('/');
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              icon: 'info',
              title: 'Recusado',
              text: 'Convite recusado.',
              confirmButtonColor: '#008B98',
            });
            navigate('/');
          }
        });

      } catch (error) {
        console.error('Erro ao obter dados do convite:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao obter dados do convite. Tente novamente mais tarde.',
        });
        navigate('/');
      }
    };

    if (token) {
      getProjetoData();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Token inválido ou ausente.',
      });
      navigate('/');
    }
  }, [token, navigate]);

  return null; // Render nothing, as we handle everything through SweetAlert2
};

export default AceitarConvite;

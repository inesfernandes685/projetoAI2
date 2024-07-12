import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/logologin.svg';
import Swal from 'sweetalert2';
import { TextField, Button, Box } from '@mui/material';

function RecuperarPasseForm() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRecuperarPasse = async () => {
        try {
            const response = await api.post('/recuperar-passe', { email });
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.message,
                icon: 'success',
                confirmButtonColor: '#008B98',
                willClose: () => {
                    navigate('/login');
                },
            });
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: error.response ? error.response.data.error : 'Erro ao recuperar a palavra-passe. Por favor, tente novamente.',
                icon: 'error',
                confirmButtonColor: '#008B98',
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRecuperarPasse();
    };

    return (
        <Box className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '60.3vh' }}>
            <header className="header mb-1">
                <img src={logo} alt="Logo" className="logo" style={{marginBottom: 30}}/>
            </header>
            <form onSubmit={handleSubmit} className="login-form">
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
                        <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 0, ml: 0 }} // Add margin bottom and left
            >
                RECUPERAR PALAVRA-PASSE
            </Button>
            <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 0, ml: 0 }} // Add margin bottom and left
            >
                CANCELAR
            </Button>
            </form>
        </Box>
    );
}

export default RecuperarPasseForm;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/logologin.svg';
import Swal from 'sweetalert2';
import './login.css';

function NovaPasseForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const navigate = useNavigate();

    const handleResetPasse = async () => {
        if (password !== confirmPassword) {
            setError(true);
            return;
        }

        setError(false);

        try {
            const response = await api.post('/nova-passe', { novaPass: password, token });
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.message,
                icon: 'success',
                confirmButtonColor: '#008B98',
                willClose: () => {
                    navigate('/login');
                    const verificationToken = localStorage.getItem('verificationToken') || sessionStorage.getItem('verificationToken');
                    if (verificationToken) {
                        localStorage.removeItem('verificationToken');
                        sessionStorage.removeItem('verificationToken');
                    }
                },
            });
        } catch (error) {
            setError(true);
            if (error.response) {
                Swal.fire({
                    title: 'Erro!',
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonColor: '#008B98',
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleResetPasse();
    };

    return (
        <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '62vh' }}>
            <header className="header mb-1">
                <img src={logo} alt="Logo" className="logo" style={{marginBottom: 30}}/>
            </header>
            <form onSubmit={handleSubmit} className="login-form">
                <div className={`form-group ${error ? 'has-error' : ''}`}>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nova Palavra-Passe"
                        style={{ backgroundColor: '#DCDCDC' }}
                    />
                </div>
                <div className={`form-group ${error ? 'has-error' : ''}`}>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Nova Palavra-Passe"
                        style={{ backgroundColor: '#DCDCDC' }}
                    />
                </div>
                <button className="btn btn-outline-success mt-2" id='botaoEntrar'>
                    ALTERAR PALAVRA-PASSE
                </button>
            </form>
        </div>
    );
}

export default NovaPasseForm;

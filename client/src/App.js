import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/auth/loginForm';
import Registar from './components/auth/registarForm';
import RecuperarPasseForm from './components/auth/recuperarPasseForm';
import NovaPasseForm from './components/auth/novaPasseForm';
import BarraNavegacao from './components/home/barranavegacao';
import Projeto from './components/projeto/projeto';
import Dashboard from './components/home/dashboard';
import AceitarConvite from './components/projeto/projetoAceitar';
import ListaUtilizadores from './components/utilizadores/listaUtilizadores';
import Calendario from './components/calendario/calendario';
import VerificarEmail from './components/auth/verificarEmail';

const AuthenticatedLayout = () => (
  <>
    <BarraNavegacao />
    <div style={{ paddingTop: '70px', paddingLeft: '25px' }}>
      <Outlet />
    </div>
  </>
);

const UnauthenticatedLayout = () => (
  <div>
    <Outlet />
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token') || !!sessionStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token') || !!sessionStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<UnauthenticatedLayout />}>
          <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="registar" element={<Registar />} />
          <Route path="recuperar-passe" element={<RecuperarPasseForm />} />
          <Route path="nova-passe" element={<NovaPasseForm />} />
          <Route path="verificar-email" element={<VerificarEmail />} />
        </Route>

        <Route path="/*" element={isAuthenticated ? <AuthenticatedLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} /> {/* Adjusted from path="/" to index */}
          <Route path="projetos" element={<Projeto />} />
          <Route path="projetos/:projetoId" element={<Projeto />} />
          <Route path="projetos/partilhar" element={<AceitarConvite />} />
          <Route path="utilizadores" element={<ListaUtilizadores />} />
          <Route path="calendario" element={<Calendario />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

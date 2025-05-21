import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import PerfilAlunoPage from './PerfilAlunoPage';
import PerfilAcademiaPage from './PerfilAcademiaPage';
import PerfilPersonalPage from './PerfilPersonalPage';
import PerfilAdminPage from './PerfilAdminPage';
import { useGetUser } from '../hooks/useGetUser';
import { toast } from 'sonner';

const PerfilRouter = () => {
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const {user, loading} = useGetUser();

  if (loading) return <p className="text-center mt-10">Carregando perfil...</p>;

  if (!user) {
    navigate('/login');
    toast.error('Você não está logado');
    return;
  }

  switch (user.role) {
    case 'USERADMIN':
      return <PerfilAdminPage user={user} />;
    case 'USERACAD':
      return <PerfilAlunoPage user={user} />;
    case 'USERACADADMIN':
      return <PerfilAcademiaPage user={user} />;
    case 'PERSONAL':
      return <PerfilPersonalPage user={user} />;
    default:
      navigate('/login');
      return null;
  }
};

export default PerfilRouter;

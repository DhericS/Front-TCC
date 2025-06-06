import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import AcademiasPage from '../pages/AcademiasPage';
import PersonaisPage from '../pages/PersonaisPage';
import TreinosPage from '../pages/TreinosPage';
import DetalhesAcademiaPage from '../pages/DetalhesAcademiaPage';
import CadastrarPlanoPage from '../pages/CadastrarPlanoPage';
import EditarPlanoPage from '../pages/EditarPlanoPage';
import CadastrarAtividadePage from '../pages/CadastrarAtividadePage';
import EditarAtividadePage from '../pages/EditarAtividadePage';
import CadastroPage from '../pages/CadastroPage';
import EditarPerfilPage from '../pages/EditarPerfilPage';
import PerfilRouter from '../pages/PerfilRouter';
import DefaultLayout from '../components/DefaultLayout';
import EditarDieta from '../pages/EditarDieta';
import EditarTreino from '../pages/EditarTreino';
import DetalhesTreinoPage from '../pages/DetalhesTreinoPage';
import DietasPage from '../pages/DietasPage';
import DetalhesDietaPage from '../pages/DetalhesDietaPage'
import EditarAcademia from '../pages/EditarAcademia';
import CadastrarAcademiaPage from '../pages/CadastrarAcademiaPage';
import DetalhesAcademiaExternaPage from "../pages/DetalhesAcademiaExternaPage";
import DetalhesPersonalPage from '../pages/DetalhesPersonalPage';
import ResetSenhaPage from '../pages/ResetSenhaPage';
import EsquecerSenhaPage from '../pages/EsquecerSenhaPage';
import NotFound from '../pages/NotFound';
import CadastrarDieta from '../pages/CadastrarDieta';
import CadastrarTreinoPage from '../pages/CadastrarTreinoPage';
import EditarDadosAcademia from '../pages/EditarDadosAcademia';
import ProtectedLayout from '../components/ProtectedLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/academias" element={<AcademiasPage />} />
        <Route path="/academias/:id/editar" element={<EditarAcademia />} />
        <Route path="/academias-externas/:placeId" element={<DetalhesAcademiaExternaPage />} /> 
        <Route path="/academias/:id" element={<DetalhesAcademiaPage />} />
        <Route path="/cadastrar-academia" element={<CadastrarAcademiaPage />} />
        <Route path="/academias/:id/editar/dados" element={<EditarDadosAcademia />} />

        <Route path="/personais" element={<PersonaisPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/treinos/:id" element={<DetalhesTreinoPage />} />
          <Route path="/dietas/:id" element={<DetalhesDietaPage />} />
          <Route path="/personais/:id" element={<DetalhesPersonalPage />} />
          <Route path="/treinos/:id/editar" element={<EditarTreino />} />
        </Route>
        
        <Route path="/treinos" element={<TreinosPage />} />
        <Route path="/treinos/cadastrar" element={<CadastrarTreinoPage />} />
        
        <Route path="/planos/cadastrar" element={<CadastrarPlanoPage />} />
        <Route path="/planos/editar/:id" element={<EditarPlanoPage />} />

        <Route path="/atividades/cadastrar" element={<CadastrarAtividadePage />} />
        <Route path="/atividades/editar/:id" element={<EditarAtividadePage />} />

        <Route path="/dietas" element={<DietasPage />} />
        <Route path="/dietas/:id/editar" element={<EditarDieta />} />
        <Route path="/dietas/cadastrar" element={<CadastrarDieta />} />

        <Route path="/cadastro" element={<CadastroPage />}/>
        <Route path="/perfil" element={<PerfilRouter />} />
        <Route path="/perfil/editar" element={<EditarPerfilPage />} />
        <Route path="/esquecer-senha" element={<EsquecerSenhaPage />} />
        <Route path="/redefinir-senha" element={<ResetSenhaPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path='*' element={<NotFound />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;


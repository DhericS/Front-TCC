import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ModalDialog from './ModalDialog';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 677);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalLogoutIsOpen, setIsModalLogoutIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 677);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('token');

  const links = [
    { path: '/academias', label: 'Academias' },
    { path: '/personais', label: 'Personais' },
    { path: '/treinos', label: 'Treinos' },
    { path: '/dietas', label: 'Dietas'},
    ...(isAuthenticated
      ? [{ path: '/perfil', label: 'Meu Perfil' }]
      : [{ path: '/login', label: 'Login' }])
  ];

  const isActive = (path) => location.pathname === path;

  const renderLinks = (className = '') => (
    <ul className={className}>
      {links.map(({ path, label }) => (
        <li key={path}>
          <Link
            to={path}
            className={`hover:underline ${isActive(path) ? 'text-blue-600 font-bold' : 'text-gray-800'}`}
          >
            {label}
          </Link>
        </li>
      ))}
      {isAuthenticated && (
        <li>
          <button
            onClick={() => setIsModalLogoutIsOpen(true)}
            className="text-gray-800 hover:underline"
          >
            Logout
          </button>
        </li>
      )}
    </ul>
  );

  return (
    <header role="banner" className="flex items-center justify-between p-4 shadow bg-white">
      <div className="logo">
        <Link to="/">
          <img
            src="/assets/imagens/logo2.png"
            alt="Logo Guides Fit"
            style={{ height: '100px', width: 'auto' }}
          />
        </Link>
      </div>

      <nav role="navigation" aria-label="Navegação principal">
        {!isMobile && renderLinks("flex gap-6 font-medium")}
      </nav>

      {isMobile && (
        <>
          <div
            className="nav-icon cursor-pointer space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>

          {menuOpen && (
            <div className="nav-small-views absolute top-20 right-4 bg-white shadow p-4 z-50 rounded">
              <nav role="navigation" aria-label="Menu mobile">
                {renderLinks("flex flex-col gap-3")}
              </nav>
            </div>
          )}
        </>
      )}

      <ModalDialog 
        description={"Você tem certeza que deseja sair?"}
        isOpen={isModalLogoutIsOpen}
        onClose={() => setIsModalLogoutIsOpen(false)}
        title="Sair"
        onConfirm={handleLogout}
        loading={false}
      />
    </header>
  );
};

export default Menu;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  PaintBucket,
  Heart,
  User,
  Crown,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const { userData, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/' || location.pathname === '/home';
    if (path === '/licoes/todas') return location.pathname.startsWith('/licoes') || location.pathname.startsWith('/licao');
    if (path === '/atividades/todas') return location.pathname.startsWith('/atividades');
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/home', icon: Home, label: 'Início' },
    { path: '/licoes/todas', icon: BookOpen, label: 'Lições' },
    { path: '/atividades/todas', icon: PaintBucket, label: 'Atividades' },
    { path: '/favoritos', icon: Heart, label: 'Favoritos' },
    { path: '/depoimentos', icon: MessageSquare, label: 'Depoimentos' },
    { path: '/bonus', icon: Crown, label: 'Bônus' },
  ];

  if (userData?.isAdmin) {
    menuItems.push({ path: '/dashboard', icon: Shield, label: 'Dashboard' });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="BibleUp Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-purple-600 dark:text-purple-600">
                BibleUp
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Toggle Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <Link
                to="/perfil"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {userData?.fotoPerfil ? (
                  <img
                    src={userData.fotoPerfil}
                    alt={userData.nome}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {userData?.nome}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Sair"
                className="p-2 rounded-lg text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu mobile"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
          >
            {menuItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                toggleTheme();
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors w-full text-left"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

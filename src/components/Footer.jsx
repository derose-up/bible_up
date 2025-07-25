import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <a href="https://facebook.com/seupagina" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <Facebook className="w-5 h-5 text-blue-600 hover:text-blue-800" />
      </a>
      <a href="https://instagram.com/seupagina" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <Instagram className="w-5 h-5 text-pink-500 hover:text-pink-700" />
      </a>
      <a href="https://twitter.com/seupagina" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <Twitter className="w-5 h-5 text-blue-400 hover:text-blue-600" />
      </a>
      <a href="https://youtube.com/seucanal" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <Youtube className="w-5 h-5 text-red-600 hover:text-red-800" />
      </a>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="mt-16 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          © {new Date().getFullYear()} <strong>BibleUp</strong>. Todos os direitos reservados.
        </p>
        <div className="flex justify-center gap-4 text-xs flex-wrap">
          <Link to="/termos" className="hover:underline">Termos de Uso</Link>
          <span>•</span>
          <Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
          <span>•</span>
          <Link to="/contato" className="hover:underline">Contato</Link>
          <span>•</span>
          <Link to="/sobre" className="hover:underline">Sobre</Link>
          <span>•</span>
          <Link to="/faq" className="hover:underline">FAQ</Link>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
};

export default Footer;

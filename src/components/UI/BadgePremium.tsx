import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown } from 'react-icons/fa';

interface BadgePremiumProps {
  isPremium: boolean;
  className?: string;
}

const BadgePremium: React.FC<BadgePremiumProps> = ({ isPremium, className = '' }) => {
  if (!isPremium) return null; // 👉 se não for premium, não renderiza nada

  return (
    <motion.div
      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold select-none shadow bg-white flex items-center gap-1 w-fit ${className}`}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <FaCrown className="text-yellow-500" />
      <span className="text-yellow-800">Premium</span>
    </motion.div>
  );
};

export default BadgePremium;

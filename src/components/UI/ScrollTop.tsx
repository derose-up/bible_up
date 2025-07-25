import React from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

interface ScrollTopProps {
  visible: boolean;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ visible }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.4 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  </motion.div>
);

export default ScrollTop;

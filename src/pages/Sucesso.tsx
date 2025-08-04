// src/pages/Sucesso.tsx

import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sucesso = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Assinatura Confirmada!</h1>
      <p className="text-gray-600 mb-4">
        Obrigado por apoiar o BibleUp! Agora você tem acesso completo às lições premium.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
      >
        Ir para o app
      </button>
    </div>
  );
};

export default Sucesso;

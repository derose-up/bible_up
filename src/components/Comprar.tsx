import { useState } from 'react';

interface ComprarProps {
  planId: string;
  userEmail: string;
  title?: string;
  price?: number;
  quantity?: number;
}

function Comprar({ planId, userEmail, title, price, quantity = 1 }: ComprarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComprar() {
    if (!planId || !userEmail) {
      setError('Dados incompletos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://us-central1-escola-biblica-admin.cloudfunctions.net/criarPreferenciaMP',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            userEmail,
             title,     // usar aqui
            price,     // usar aqui
            quantity,  // usar aqui
            }),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Erro ao criar preferência');
      }

      const data = await response.json();

      if (!data.init_point) {
        throw new Error('Resposta inválida do servidor');
      }

      window.location.href = data.init_point;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleComprar} disabled={loading}>
        {loading ? 'Carregando...' : 'Comprar Agora'}
      </button>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
}

export default Comprar;

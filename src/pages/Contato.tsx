import React, { useState } from 'react';
import { db } from '../services/firebase'; // ajuste o caminho se necessário
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'mensagensContato'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      toast.success('Mensagem enviada com sucesso!');
      setFormData({ nome: '', email: '', mensagem: '' });
    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-600">Entre em Contato</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <textarea
            name="mensagem"
            placeholder="Digite sua mensagem"
            rows={5}
            value={formData.mensagem}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          ></textarea>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Contato;

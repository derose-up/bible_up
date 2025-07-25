import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Lessons from '../src/pages/Lessons';
import { useAuth } from '../src/contexts/AuthContext';
import * as firebaseService from '../src/services/firebase';
import { MemoryRouter } from 'react-router-dom';
import { getDocs, collection, orderBy, query } from '../src/services/firebase';
import { db } from '../services/firebase';

jest.mock('../src/contexts/AuthContext');
jest.mock('../src/services/firebase', () => require('../src/services/__mocks__/firebase'));
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
  toast: jest.fn(),
}));
jest.mock('../src/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Lessons Component', () => {
  const mockUser = {
    uid: 'user123',
    status: 'premium',
    isAdmin: false,
  };

  beforeEach(() => {
  const fakeDocs = [
    {
      id: 'licao1',
      data: () => ({
        titulo: 'Lição 1',
        categoria: 'Kids',
        isPremium: false,
        createdAt: { toDate: () => new Date() },
        favoritadoPor: [],
        desenhoUrl: '',
        tags: ['oração'],
        historia: 'História da Lição 1\nTexto adicional',
      }),
    },
    {
      id: 'licao2',
      data: () => ({
        titulo: 'Lição Premium',
        categoria: 'Juniores',
        isPremium: true,
        createdAt: { toDate: () => new Date() },
        favoritadoPor: ['user123'],
        desenhoUrl: '',
        tags: ['fé'],
        historia: 'História da Lição Premium\nTexto adicional',
      }),
    },
  ];

  collection.mockReturnValue({});
  query.mockReturnValue({});
  orderBy.mockReturnValue({});
  getDocs.mockResolvedValue({ docs: fakeDocs });
});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza lista de lições', async () => {
    renderWithRouter(<Lessons />);

    expect(screen.getByPlaceholderText(/buscar lições/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Lição 1')).toBeInTheDocument();
      expect(screen.getByText('Lição Premium')).toBeInTheDocument();
    });
  });

  test('filtra lições por busca', async () => {
    renderWithRouter(<Lessons />);

    const inputBusca = screen.getByPlaceholderText(/buscar lições/i);
    await userEvent.type(inputBusca, 'premium');

    await waitFor(() => {
      expect(screen.queryByText('Lição 1')).not.toBeInTheDocument();
      expect(screen.getByText('Lição Premium')).toBeInTheDocument();
    });
  });

  test('botão favoritar chama função corretamente', async () => {
    renderWithRouter(<Lessons />);

    await waitFor(() => {
      expect(screen.getByText('Lição Premium')).toBeInTheDocument();
    });

    const botoesFavoritar = screen.getAllByRole('button', { name: /desfavoritar|favoritar/i });
    expect(botoesFavoritar.length).toBeGreaterThan(0);

    await userEvent.click(botoesFavoritar[1]);

    await waitFor(() => {
      expect(firebaseService.updateDoc).toHaveBeenCalled();
    });
  });

  test('exibe mensagem de erro ao falhar na busca', async () => {
    (firebaseService.getDocs as jest.Mock).mockRejectedValueOnce(new Error('Falha na busca'));

    renderWithRouter(<Lessons />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/erro/i);
    });
  });
});

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Usuario } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<Usuario>) => Promise<void>;
}

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  whatsapp: string;
  igreja: string;
  funcaoMinisterial: string;
  fotoPerfil?: string;
  concordaReceberEmail?: boolean;
  concordaReceberWhatsapp?: boolean;
  tagsMarketing?: string[];
  preferenciasConteudo?: string[];
  campanhaOrigem?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Salva o UID atual no localStorage para controle de lições vistas por usuário
      if (user?.uid) {
        localStorage.setItem('auth_uid', user.uid);
      }
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              uid: user.uid,
              ...data,
              dataCadastro: data.dataCadastro?.toDate() || new Date(),
              ultimoAcesso: data.ultimoAcesso?.toDate() || new Date(),
              atualizadoEm: data.atualizadoEm?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Usuario);

            // Atualizar último acesso
            await updateDoc(doc(db, 'usuarios', user.uid), {
              ultimoAcesso: serverTimestamp()
            });
          }
        } catch (error: unknown) {
          console.error('Erro ao carregar dados do usuário:', error);
          // Em caso de erro, criar dados básicos do usuário
          const basicUserData: Omit<Usuario, 'uid'> = {
            nome: user.displayName || 'Usuário',
            email: user.email || '',
            whatsapp: '',
            igreja: '',
            funcaoMinisterial: '',
            status: 'free',
            isAdmin: false,
            fotoPerfil: user.photoURL || '',
            dataCadastro: new Date(),
            ultimoAcesso: new Date(),
            atualizadoEm: new Date(),
            updatedAt: new Date(),
            favoritadoPor: []
          };
          setUserData({ uid: user.uid, ...basicUserData });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // A notificação será exibida na tela Login.tsx
  } catch (error: unknown) {
    console.error('Erro no login:', error);
    let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      const e = error as { code?: string };
    if (e.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado.';
    } else if (e.code === 'auth/wrong-password') {
      errorMessage = 'Senha incorreta.';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido.';
    }

    toast.error(errorMessage);
    throw error;
  }
};

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Extrai tagsMarketing baseadas nas preferencias + funcaoMinisterial
      const tagsPreferencias = Array.isArray(data.preferenciasConteudo) ? data.preferenciasConteudo : [];
      const tagsMarketing = [
        ...tagsPreferencias,
        ...(data.funcaoMinisterial ? [data.funcaoMinisterial] : [])
      ];

      // Captura campanha de origem da URL, ou usa 'orgânico' se não existir
      const urlParams = new URLSearchParams(window.location.search);
      const campanhaOrigem = urlParams.get('utm_campaign') || 'orgânico';

      const userData: Omit<Usuario, 'uid'> = {
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        igreja: data.igreja,
        funcaoMinisterial: data.funcaoMinisterial,
        status: 'free',
        isAdmin: false,
        fotoPerfil: data.fotoPerfil || '',
        concordaReceberEmail: data.concordaReceberEmail ?? false,
        concordaReceberWhatsapp: data.concordaReceberWhatsapp ?? false,
        tagsMarketing,
        preferenciasConteudo: tagsPreferencias,
        campanhaOrigem,
        dataCadastro: new Date(),
        ultimoAcesso: new Date(),
        atualizadoEm: new Date(),
        updatedAt: new Date(),
        favoritadoPor: []
      };

      await setDoc(doc(db, 'usuarios', user.uid), {
        ...userData,
        dataCadastro: serverTimestamp(),
        ultimoAcesso: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Cadastro realizado com sucesso!');
    } catch (error: unknown) {
      console.error('Erro no cadastro:', error);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      const e = error as { code?: string };
    if (e.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email já está em uso.';
    } else if (e.code === 'auth/weak-password') {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido.';
    }

    toast.error(errorMessage);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout.');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de recuperação enviado!');
    } catch (error: unknown) {
      console.error('Erro ao enviar email de recuperação:', error);
      let errorMessage = 'Erro ao enviar email de recuperação.';
      
      const e = error as { code?: string };
    if (e.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado.';
    } else if (e.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido.';
    }

    toast.error(errorMessage);
    throw error;
  }
};

  const updateUserData = async (data: Partial<Usuario>) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'usuarios', user.uid), {
        ...data,
        updatedAt: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      });

      setUserData(prev => prev ? { ...prev, ...data } : null);
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados.');
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

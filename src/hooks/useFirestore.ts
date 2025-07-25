import { useEffect, useState } from 'react';
import { db } from "../services/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Usuario } from '../types/Usuario'; // Ajuste o caminho conforme seu projeto

export const useFirestore = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const fetchUsuarios = async () => {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const dados = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Usuario[];
    setUsuarios(dados);
  };

  const updateUsuario = async (id: string, data: Partial<Usuario>) => {
    const ref = doc(db, 'usuarios', id);
    await updateDoc(ref, data);
    await fetchUsuarios();
  };

  const deleteUsuario = async (id: string) => {
    const ref = doc(db, 'usuarios', id);
    await deleteDoc(ref);
    await fetchUsuarios();
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    updateUsuario,
    deleteUsuario
  };
};

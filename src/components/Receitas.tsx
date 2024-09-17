import React, { useState, useEffect } from 'react';
import { db, auth } from '../service/firebase'; // Importar Firestore e Auth
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface ReceitasProps {
  onUpdate: () => void;
}

const Receitas: React.FC<ReceitasProps> = ({ onUpdate }) => {
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>('');
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar receitas do Firestore
  const fetchReceitas = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'receitas'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const receitasList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReceitas(receitasList);
      setLoading(false);
    }
  };

  // Carregar receitas do usuário logado ao montar o componente
  useEffect(() => {
    fetchReceitas();
  }, []);

  // Adicionar receita
  const adicionarReceita = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('Nenhum usuário logado');
      return;
    }

    if (!valor || valor <= 0) {
      console.error('Valor inválido para a receita');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'receitas'), {
        valor,
        descricao,
        userId: user.uid,
        createdAt: new Date(),
      });
      console.log('Receita adicionada com sucesso: ', docRef.id);
      setValor(0);
      setDescricao('');
      fetchReceitas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao adicionar receita: ', e);
    }
  };

  // Editar receita
  const editarReceita = async (id: string, novoValor: number, novaDescricao: string) => {
    try {
      const receitaDoc = doc(db, 'receitas', id);
      await updateDoc(receitaDoc, { valor: novoValor, descricao: novaDescricao });
      fetchReceitas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao editar receita:', e);
    }
  };

  // Excluir receita
  const excluirReceita = async (id: string) => {
    try {
      const receitaDoc = doc(db, 'receitas', id);
      await deleteDoc(receitaDoc);
      fetchReceitas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao excluir receita:', e);
    }
  };

  if (loading) {
    return <p>Carregando receitas...</p>;
  }

  return (
    <div>
      <h3>Adicionar Receita</h3>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        placeholder="Valor da receita"
      />
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição da receita"
      />
      <button onClick={adicionarReceita}>Adicionar Receita</button>

      <h3>Receitas</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {receitas.map((receita) => (
            <tr key={receita.id}>
              <td>R$ {receita.valor}</td>
              <td>{receita.descricao}</td>
              <td>
                <button 
                  onClick={() => {
                    const novaDescricao = prompt('Nova descrição:', receita.descricao) ?? receita.descricao;
                    const novoValor = Number(prompt('Novo valor:', receita.valor)) || receita.valor;
                    editarReceita(receita.id, novoValor, novaDescricao);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => excluirReceita(receita.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Receitas;

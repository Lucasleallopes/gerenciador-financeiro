import React, { useState, useEffect } from 'react';
import { db, auth } from '../service/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface DespesasProps {
  onUpdate: () => void;
}

const Despesas: React.FC<DespesasProps> = ({ onUpdate }) => {
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>('');
  const [despesas, setDespesas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar despesas do Firestore
  const fetchDespesas = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'despesas'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const despesasList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDespesas(despesasList);
      setLoading(false);
    }
  };

  // Carregar despesas do usuário logado ao montar o componente
  useEffect(() => {
    fetchDespesas();
  }, []);

  // Adicionar despesa
  const adicionarDespesa = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('Nenhum usuário logado');
      return;
    }

    if (!valor || valor <= 0) {
      console.error('Valor inválido para a despesa');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'despesas'), {
        valor,
        descricao,
        userId: user.uid,
        createdAt: new Date(),
      });
      console.log('Despesa adicionada com sucesso: ', docRef.id);
      setValor(0);
      setDescricao('');
      fetchDespesas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao adicionar despesa: ', e);
    }
  };

  // Editar despesa
  const editarDespesa = async (id: string, novoValor: number, novaDescricao: string) => {
    try {
      const despesaDoc = doc(db, 'despesas', id);
      await updateDoc(despesaDoc, { valor: novoValor, descricao: novaDescricao });
      fetchDespesas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao editar despesa:', e);
    }
  };

  // Excluir despesa
  const excluirDespesa = async (id: string) => {
    try {
      const despesaDoc = doc(db, 'despesas', id);
      await deleteDoc(despesaDoc);
      fetchDespesas();
      onUpdate();
    } catch (e) {
      console.error('Erro ao excluir despesa:', e);
    }
  };

  if (loading) {
    return <p>Carregando despesas...</p>;
  }

  return (
    <div>
      <h3>Adicionar Despesa</h3>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        placeholder="Valor da despesa"
      />
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição da despesa"
      />
      <button onClick={adicionarDespesa}>Adicionar Despesa</button>

      <h3>Despesas</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {despesas.map((despesa) => (
            <tr key={despesa.id}>
              <td>R$ {despesa.valor}</td>
              <td>{despesa.descricao}</td>
              <td>
                <button
                  onClick={() => {const novaDescricao = prompt('Nova descrição:', despesa.descricao) ?? despesa.descricao;
                  editarDespesa(despesa.id, Number(prompt('Novo valor:', despesa.valor)), novaDescricao);}}>
                  Editar
                </button>
                <button onClick={() => excluirDespesa(despesa.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Despesas;

import React, { useEffect, useState } from 'react';
import { db, auth } from '../../service/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from 'chart.js';

import Receitas from '../../components/Receitas';
import Despesas from '../../components/Despesas';
import './style.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [receitas, setReceitas] = useState<number[]>([]);
  const [despesas, setDespesas] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const user = auth.currentUser;

    if (user) {
      setLoading(true);

      // Consultar receitas e despesas
      const receitasQuery = query(collection(db, 'receitas'), where('userId', '==', user.uid));
      const despesasQuery = query(collection(db, 'despesas'), where('userId', '==', user.uid));

      const receitasSnapshot = await getDocs(receitasQuery);
      const despesasSnapshot = await getDocs(despesasQuery);

      const receitasList = receitasSnapshot.docs.map((doc) => doc.data().valor);
      const despesasList = despesasSnapshot.docs.map((doc) => doc.data().valor);

      setReceitas(receitasList);
      setDespesas(despesasList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>📊 Carregando dados...</p>;
  }

  const totalReceitas = receitas.reduce((acc, receita) => acc + receita, 0);
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa, 0);
  const saldoRestante = totalReceitas - totalDespesas;

  const data = {
    labels: ['Receitas', 'Despesas', 'Saldo Restante'],
    datasets: [
      {
        label: 'Valores em R$',
        data: [totalReceitas, totalDespesas, saldoRestante],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="container-dashboard">
      <h1>Dashboard</h1>
      <div className="chart-container">
        <Bar data={data} />
      </div>

      <p>📊 Total de Receitas: R$ {totalReceitas}</p>
      <p>📊 Total de Despesas: R$ {totalDespesas}</p>
      <p>📊 Saldo Restante: R$ {saldoRestante}</p>

      <div className="data-container">
        <div className="input-container">
          <Receitas onUpdate={fetchData} />
        </div>
        <div className="input-container">
          <Despesas onUpdate={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

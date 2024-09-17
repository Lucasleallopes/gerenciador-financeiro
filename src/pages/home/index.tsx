import React from 'react';
import './style.css';

const Home: React.FC = () => {
    return (
        <div className='container-home'>
            <h1>Bem-vindo ao Gerenciador de Orçamento Pessoal</h1>
            <p> O <strong>Gerenciador de Orçamento Pessoal</strong> é uma aplicação projetada para facilitar a gestão das suas finanças pessoais. Com ele, você pode acompanhar sua renda e suas despesas de forma prática e eficiente, tudo em um só lugar.</p>
            <p> O funcionamento é simples: após criar sua conta, você poderá adicionar entradas de receitas (como seu salário ou outras fontes de renda) e suas despesas (como contas, compras ou outros gastos). A plataforma exibirá automaticamente um resumo do seu saldo, total de receitas e total de despesas, permitindo que você visualize sua saúde financeira de forma clara.</p>
            <p>Nosso objetivo é ajudar você a tomar decisões financeiras mais informadas e a alcançar uma melhor gestão do seu dinheiro. Você também terá acesso a gráficos interativos no <strong>Dashboard</strong> para acompanhar suas finanças ao longo do tempo.</p>
            <p><strong>Para começar:</strong> crie sua conta ou faça login com sua conta Google ou email. Depois disso, você terá acesso completo ao <strong>Dashboard</strong>, onde poderá inserir suas receitas e despesas e ver um resumo financeiro completo.</p>
        </div>
    );
}

export default Home;

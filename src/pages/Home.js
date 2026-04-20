import { useEffect, useState } from 'react';
import Header from '../components/Header';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import ResponsiveAppBar from '../components/AppBar';
import { API_ENDPOINTS } from '../config/api';

function Home() {
  const [miniaturas, setMiniaturas] = useState([]); // estado da lista de miniaturas

  // Função para buscar miniaturas do backend e atualizar estado
  const fetchMiniaturas = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.MINIATURAS);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setMiniaturas(data); // atualiza estado
    } catch (error) {
      console.error('Erro ao buscar miniaturas:', error);
    }
  };

  useEffect(() => { fetchMiniaturas(); }, []); // roda apenas uma vez ao abrir app

  // Função para adicionar nova miniatura na lista 
  const handleAdd = (newMini) => {
    setMiniaturas([...miniaturas, newMini]); // adiciona nova miniatura
  };

  // Quando deletar
  const handleDelete = (id) => {
    setMiniaturas(miniaturas.filter(m => m.id !== id));
  };

  // Quando atualizar
  const handleUpdate = (updatedMini) => {
    setMiniaturas(miniaturas.map(m => m.id === updatedMini.id ? updatedMini : m));
  };

  return (
    <div className="page-shell" style={{
      backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${planoFundo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <ResponsiveAppBar />
      <Header />
      {/* TODO mexido para testes de estilos */}
      <div className="surface">
        <MiniatureForm onAdd={handleAdd} />
        <MiniatureList miniaturas={miniaturas} onDelete={handleDelete} onUpdate={handleUpdate} modo="home" />
      </div>
    </div>
  );
}

export default Home;

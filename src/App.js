import { useEffect, useState } from 'react';
import Header from './components/Header';
import MiniaturaForm from './components/MiniaturaForm';
import MiniaturaList from './components/MiniaturaList';
import planoFundo from './img/plano-de-fundo-v2.jpeg';
import ResponsiveAppBar from './components/AppBar';

function App() {
  const [miniaturas, setMiniaturas] = useState([]); // estado da lista de miniaturas

  // Função para buscar miniaturas do backend 
  const fetchMiniaturas = async () => {
    const res = await fetch('http://localhost:5000/miniaturas'); // GET
    const data = await res.json();
    setMiniaturas(data); // atualiza estado
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

  return (

    <div style={{
      backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5),
     rgba(0, 0, 0, 0.8)), 
     url(${planoFundo})`, backgroundSize: 'cover',
      backgroundPosition: 'center', backgroundAttachment: 'fixed',
      minHeight: '100vh', padding: '20px'
    }}>

      <ResponsiveAppBar />
      <Header />
      <MiniaturaForm onAdd={handleAdd} />
      {/* <MiniaturaList miniaturas={miniaturas} /> */}
      <MiniaturaList miniaturas={miniaturas} onDelete={handleDelete} />

    </div>
  );
  //   <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
  //     <h1 style={{ color: '#333' }}>Mini Paint Manager</h1>

  //     {/* Formulário de cadastro */}
  //     <MiniaturaForm onAdd={handleAdd} />

  //     {/* Lista de miniaturas */}
  //     <MiniaturaList miniaturas={miniaturas} />
  //   </div>
  // );
}

export default App;

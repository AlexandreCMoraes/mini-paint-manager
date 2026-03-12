import { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../data/formOptions';

export default function MiniaturaForm({ onAdd }) {

  // Estados do formulário
  const [nomeDoPersonagem, setNomeDoPersonagem] = useState('');
  const [universo, setUniverso] = useState('');
  const [escala, setEscala] = useState('');
  const [material, setMaterial] = useState('');
  const [marca, setMarca] = useState('');
  const [altura, setAltura] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Função de envio
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação antes de tudo
    if (!nomeDoPersonagem || !universo || !escala || !material || !altura || !marca) {
      setMensagemErro("Por favor, preencha todos os campos antes de adicionar a miniatura!");
      setTimeout(() => setMensagemErro(''), 5000);
      return;
    }

    const newMini = {
      nomeDoPersonagem,
      universo,
      escala,
      material,
      marca,
      altura: parseFloat(altura)
    };

    try {
      const res = await fetch('http://localhost:5000/miniaturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMini)
      });

      const data = await res.json();

      // Atualiza lista no componente pai
      if (onAdd) {
        onAdd(data);
      }

      //  Mensagem de sucesso
      setMensagemSucesso(`Miniatura "${nomeDoPersonagem}" adicionada com sucesso!`);
      setMensagemErro('');
      setTimeout(() => setMensagemSucesso(''), 5000);

      //  Limpa campos
      setNomeDoPersonagem('');
      setUniverso('');
      setEscala('');
      setMaterial('');
      setAltura('');
      setMarca('');

    } catch (error) {
      console.error("Erro ao salvar miniatura:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Render
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'rgba(26, 26, 46, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        color: colors.textLight,
        fontFamily
      }}
    >

      {/* Notificação de sucesso */}
      <Notification
        open={!!mensagemSucesso}
        message={mensagemSucesso}
        severity="success"
        onClose={() => setMensagemSucesso('')}
      // duration={5000}
      />

      {/* Notificação de erro */}
      <Notification
        open={!!mensagemErro}
        message={mensagemErro}
        severity="warning"
        onClose={() => setMensagemErro('')}
      // duration={5000}
      />

      <input
        id="nomeDoPersonagem"
        name="nomeDoPersonagem"
        placeholder="Nome do Personagem"
        value={nomeDoPersonagem}
        onChange={e => setNomeDoPersonagem(e.target.value)}
        style={inputStyle}
      />

      <input
        id="universo"
        name="universo"
        placeholder="Universo (Marvel, DC, Video-Game, etc)"
        value={universo}
        onChange={e => setUniverso(e.target.value)}
        list="universos"
        style={inputStyle}
      />
      <datalist id="universos">
        {universoOptions.map((universo, index) => (
          <option key={index} value={universo} />
        ))}
      </datalist>

      <input
        id="escala"
        name="escala"
        placeholder="Escala (1:12, 1:24, etc)"
        value={escala}
        onChange={e => {
          const valor = e.target.value;
          // Aceita apenas números, ":" ou "N/A"
          if (valor === '' || valor === 'N/A' || /^[\d:]*$/.test(valor)) {
            setEscala(valor);
          }
        }}
        list="escalas"
        style={inputStyle}
        tooltipText="A escala indica o tamanho da miniatura em relação ao objeto real, por exemplo 1:12 significa 1/12 do tamanho real."

      />
      <datalist id="escalas">
        {escalasOptions.map((escala, index) => (
          <option key={index} value={escala} />
        ))}
      </datalist>

      <input
        id="material"
        name="material"
        placeholder="Material (Plástico, Resina, etc)"
        value={material}
        onChange={e => setMaterial(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
        list="materiais"
        style={inputStyle}
      />
      <datalist id="materiais">
        {materiaisOptions.map((mat, index) => (
          <option key={index} value={mat} />
        ))}
      </datalist>

      <input
        id="marca"
        name="marca"
        placeholder="Marca da Resina/Filamento"
        value={marca}
        onChange={e => setMarca(e.target.value)}
        list="marcas"
        style={inputStyle}
      />
      <datalist id="marcas">
        {marcasOptions.map((marca, index) => (
          <option key={index} value={marca} />
        ))}
      </datalist>

      <input
        id="altura"
        name="altura"
        placeholder="Altura (cm)"
        type="number"
        value={altura}
        onChange={e => setAltura(e.target.value)}
        style={inputStyle}
      />
      {/* Botao add miniatura */}
      <button
        type="submit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          background: colors.primaryButton,
          color: '#000',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: isHovered ? '0 0 15px #00ffcc' : '0 0 10px #00ffcc',
          transition: '0.3s',
          transform: isHovered ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        Adicionar Miniatura
      </button>

    </form>
  );
}

// Estilo reutilizável dos inputs
const inputStyle = {
  padding: '8px',
  borderRadius: '5px',
  border: 'none',
  background: '#0f3460',
  color: '#fff'
};



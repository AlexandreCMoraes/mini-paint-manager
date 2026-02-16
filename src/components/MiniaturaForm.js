import { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';

export default function MiniaturaForm({ onAdd }) {

  // Estados do formulário
  const [nomeDoPersonagem, setNomeDoPersonagem] = useState('');
  // const [personagem, setPersonagem] = useState('');
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
      // setPersonagem('');
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
        placeholder="Nome do Personagem"
        value={nomeDoPersonagem}
        onChange={e => setNomeDoPersonagem(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Universo (Marvel, DC, Video-Game, etc)"
        value={universo}
        onChange={e => setUniverso(e.target.value)}
        list="universos"
        style={inputStyle}
      />
      <datalist id="universos">
        <option value="sem dados" />
        <option value="Marvel" />
        <option value="DC" />
        <option value="Star Wars" />
        <option value="Harry Potter" />
        <option value="Anime" />
        <option value="Tokusatsu" />
        <option value="Video-Game" />
        <option value="Originalidade" />
        <option value="Religião" />
      </datalist>

      <input
        placeholder="Escala (1:12, 1:24, etc)"
        value={escala}
        onChange={e => {
          const valor = e.target.value;
          // Aceita apenas números, ":" ou "sem dados"
          if (valor === '' || valor === 'sem dados' || /^[\d:]*$/.test(valor)) {
            setEscala(valor);
          }
        }}
        list="escalas"
        style={inputStyle}
      />
      <datalist id="escalas">
        <option value="sem dados" />
        <option value="1:6" />
        <option value="1:12" />
        <option value="1:18" />
        <option value="1:24" />
        <option value="1:48" />
        <option value="1:72" />
      </datalist>

      <input
        placeholder="Material (Plástico, Resina, etc)"
        value={material}
        onChange={e => setMaterial(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
        list="materiais"
        style={inputStyle}
      />
      <datalist id="materiais">
        <option value="sem dados" />
        {/* Plásticos comuns */}
        <option value="ABS" />
        <option value="PLA" />
        <option value="PETG" />
        {/* Plásticos para engenharia */}
        <option value="PC" />
        <option value="Nylon" />
        <option value="PC-ABS" />
        <option value="PC-ISSO" />
        <option value="PSU" />
        {/* Resinas */}
        <option value="Resina termolítica" />
        <option value="Resina fotossensível" />
        <option value="Resina epóxi" />
        {/* Borracha */}
        <option value="Borracha natural" />
        <option value="Borracha sintética" />
        {/* Metálicos */}
        <option value="Aço inoxidável" />
        <option value="Alumínio" />
        <option value="Liga de titânio" />
        <option value="Cobre" />
        <option value="Metais preciosos" />
      </datalist>

      <input
        placeholder="Marca da Resina/Filamento"
        value={marca}
        onChange={e => setMarca(e.target.value)}
        list="marcas"
        style={inputStyle}
      />
      <datalist id="marcas">
        <option value="sem dados" />
        <option value="Anycubic" />
        <option value="Elegoo" />
        <option value="Creality" />
        <option value="Formlabs" />
        <option value="Phrozen" />
        <option value="MoonRay" />
        <option value="Photocura" />
        <option value="Slim3D" />
        <option value="3D Cure" />
        <option value="eSUN" />
        <option value="Sunlu" />
        <option value="Hatchbox" />
        <option value="Overture" />
        <option value="Inland" />
        <option value="Prusament" />
        <option value="Bambu Lab" />
        <option value="GTMax3D" />
        <option value="Voolt3D" />
        <option value="3DFila" />
        <option value="3D Lab" />
        <option value="Dynalabs" />
        <option value="3nMax" />
        <option value="3n3" />
        <option value="Multifila" />
        <option value="Desktop Metal" />
        <option value="Stratasys" />
        <option value="Zortrax" />
        <option value="ColorFabb" />
      </datalist>

      <input
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



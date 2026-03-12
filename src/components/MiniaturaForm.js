import { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';
import { API_ENDPOINTS, NOTIFICATION_TIMEOUT } from '../config/api';
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../data/formOptions';

const INITIAL_FORM_STATE = {
  nomeDoPersonagem: '',
  universo: '',
  escala: '',
  material: '',
  marca: '',
  altura: ''
};

export default function MiniaturaForm({ onAdd }) {

  // Estados consolidados
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Handle para mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validação especial para escala
    if (name === 'escala') {
      if (value !== '' && value !== 'N/A' && !/^[\d:]*$/.test(value)) {
        return; // Não aceita valores inválidos
      }
    }

    // Capitalização para material
    if (name === 'material' && value) {
      setFormData({
        ...formData,
        [name]: value.charAt(0).toUpperCase() + value.slice(1)
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função de envio
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação antes de tudo
    if (!formData.nomeDoPersonagem || !formData.universo || !formData.escala || 
        !formData.material || !formData.altura || !formData.marca) {
      setMensagemErro("Por favor, preencha todos os campos antes de adicionar a miniatura!");
      setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
      return;
    }

    const newMini = {
      nomeDoPersonagem: formData.nomeDoPersonagem,
      universo: formData.universo,
      escala: formData.escala,
      material: formData.material,
      marca: formData.marca,
      altura: parseFloat(formData.altura)
    };

    try {
      const res = await fetch(API_ENDPOINTS.MINIATURAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMini)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Atualiza lista no componente pai
      if (onAdd) {
        onAdd(data);
      }

      // Mensagem de sucesso
      setMensagemSucesso(`Miniatura "${formData.nomeDoPersonagem}" adicionada com sucesso!`);
      setMensagemErro('');
      setTimeout(() => setMensagemSucesso(''), NOTIFICATION_TIMEOUT);

      // Limpa campos
      setFormData(INITIAL_FORM_STATE);

    } catch (error) {
      console.error("Erro ao salvar miniatura:", error);
      setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
      setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
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
      />

      {/* Notificação de erro */}
      <Notification
        open={!!mensagemErro}
        message={mensagemErro}
        severity="warning"
        onClose={() => setMensagemErro('')}
      />

      <input
        id="nomeDoPersonagem"
        name="nomeDoPersonagem"
        placeholder="Nome do Personagem"
        value={formData.nomeDoPersonagem}
        onChange={handleInputChange}
        style={inputStyle}
      />

      <input
        id="universo"
        name="universo"
        placeholder="Universo (Marvel, DC, Video-Game, etc)"
        value={formData.universo}
        onChange={handleInputChange}
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
        value={formData.escala}
        onChange={handleInputChange}
        list="escalas"
        style={inputStyle}
        title="A escala indica o tamanho da miniatura em relação ao objeto real, por exemplo 1:12 significa 1/12 do tamanho real."
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
        value={formData.material}
        onChange={handleInputChange}
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
        value={formData.marca}
        onChange={handleInputChange}
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
        value={formData.altura}
        onChange={handleInputChange}
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



import { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';
import Button from './Buttons/Button';
import { handleInputChange, handleSubmitMiniatura } from '../actions/miniaturasActions';
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../data/formOptions';
import Box from '@mui/material/Box';

// Estado inicial do formulário
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

  // Handle para mudanças no formulário
  const handleChange = (e) => handleInputChange(e, formData, setFormData);

  // Função de envio
  const handleSubmit = (e) => handleSubmitMiniatura(e,
    formData,
    onAdd,
    setMensagemSucesso,
    setMensagemErro,
    setFormData,
    INITIAL_FORM_STATE);

  // Render
  return (
    <form
      className="miniatura-form"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        // TODO mexido para testes de estilos
        // background: 'rgba(26, 26, 46, 0.8)',
        // padding: '20px',
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: 'rgba(26, 26, 46, 0.8)',
          padding: '20px',
          borderRadius: '10px',
        }}
      >

        {/* Input para o nome do personagem */}
        <input
          id="nomeDoPersonagem"
          name="nomeDoPersonagem"
          placeholder="Nome do Personagem"
          // label="Nome do Personagem"
          value={formData.nomeDoPersonagem}
          onChange={handleChange}
          style={inputStyle}
          title='O nome do personagem é o nome da miniatura, por exemplo "Homem-Aranha" ou "Master Chief".'
        />
        {/* Input para o universo */}
        <input
          id="universo"
          name="universo"
          placeholder="Universo (Marvel, DC, Video-Game, etc)"
          value={formData.universo}
          onChange={handleChange}
          list="universos"
          style={inputStyle}
          title='O universo indica a origem do personagem, por exemplo "Marvel", "DC", ou "Video-Game".'
        />
        <datalist id="universos">
          {universoOptions.map((universo, index) => (
            <option key={index} value={universo} />
          ))}
        </datalist>
        {/* Input para a escala */}
        <input
          id="escala"
          name="escala"
          placeholder="Escala (1:12, 1:24, N/A)"
          value={formData.escala}
          onChange={handleChange}
          pattern="^(\d+:\d+|N/A)$"
          list="escalas"
          style={inputStyle}
          title="A escala deve ser no formato 1:12, 1:24, etc, ou N/A."
        />
        <datalist id="escalas">
          {escalasOptions.map((escala, index) => (
            <option key={index} value={escala} />
          ))}
        </datalist>
        {/* Input para o material */}
        <input
          id="material"
          name="material"
          placeholder="Material (Plástico, Resina, etc)"
          value={formData.material}
          onChange={handleChange}
          list="materiais"
          style={inputStyle}
          title="O material indica o tipo de substância usada para criar a miniatura, por exemplo 
        plástico ou resina."

        />
        <datalist id="materiais">
          {materiaisOptions.map((mat, index) => (
            <option key={index} value={mat} />
          ))}
        </datalist>
        {/* Input para a marca da resina/filamento */}
        <input
          id="marca"
          name="marca"
          placeholder="Marca da Resina/Filamento"
          value={formData.marca}
          onChange={handleChange}
          list="marcas"
          style={inputStyle}
          title='A marca indica o fabricante do material usado para criar a miniatura, por exemplo 
        "Elegoo" ou "Anycubic".'
        />
        <datalist id="marcas">
          {marcasOptions.map((marca, index) => (
            <option key={index} value={marca} />
          ))}
        </datalist>
        {/* Input para a altura */}
        <input
          id="altura"
          name="altura"
          placeholder="Altura (cm)"
          type="number"
          value={formData.altura}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
          style={inputStyle}
          title='A altura indica a medida vertical da miniatura em centímetros, por exemplo "15" 
        para uma miniatura de 15 cm de altura.'
        />
        <h6 style={{
          color: '#fff',
          textAlign: 'center'
        }}>
          Para adicionar imagens e editar todos os detalhes, acesse o Dashboard.
        </h6>
        {/* Botao add miniatura form */}
        <Button type='submit' label='Adicionar Miniatura' variant='primary' />
        {/* <AddButton label='Adicionar Miniatura' isHovered={isHovered} setIsHovered={setIsHovered} /> */}
      </Box>
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



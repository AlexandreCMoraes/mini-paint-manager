import React, { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';
import DeleteButton from './Buttons/DeleteButton';
import EditButton from './Buttons/EditButton';
import CancelButton from './Buttons/CancelButton';
import AddButton from './Buttons/AddButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { handleDeleteMiniatura, handleSaveMiniatura } from '../actions/miniaturasActions';

export default function MiniaturaList({ miniaturas, onDelete, onUpdate }) {
  // Estados para modal de edição da miniatura
  const [open, setOpen] = useState(false);
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  // Estados para notificações
  const [mensagemDelete, setMensagemDelete] = useState('');
  const [severidade, setSeveridade] = useState('success');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  // Handle para deletar miniatura
  const handleDelete = (id) => handleDeleteMiniatura(id, onDelete, setMensagemDelete, setSeveridade);

  // clicar em editar abre modal
  const handleEditClick = (mini) => {
    setSelectedMiniatura(mini);
    setEditFormData({
      nomeDoPersonagem: mini.nome,
      universo: mini.universo,
      escala: mini.escala,
      material: mini.material,
      marca: mini.marca,
      altura: mini.altura.toString()
    });
    setOpen(true);
  };

  // salvar edição
  const handleSave = (e) => handleSaveMiniatura(e, editFormData, selectedMiniatura.id, onUpdate, setMensagemSucesso, setMensagemErro, setOpen, setSeveridade);

  return (
    <div style={{ marginTop: '20px', fontFamily }}>
      {/* Notificação de delete */}
      <Notification
        open={!!mensagemDelete}
        message={mensagemDelete}
        severity={severidade}
        onClose={() => setMensagemDelete('')}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      {/* Notificação de sucesso de edição */}
      <Notification
        open={!!mensagemSucesso}
        message={mensagemSucesso}
        severity="success"
        onClose={() => setMensagemSucesso('')}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <h2 style={{
        color: colors.primaryButton,
        textAlign: 'center',
        textShadow: '0 0 5px #00ffcc'
      }}>Miniaturas Cadastradas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {miniaturas.slice().reverse().map(m => (
          <li key={m.id} style={{
            background: 'rgba(26, 26, 46, 0.8)',
            color: colors.textLight,
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px #00ffcc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            <div>
              <strong style={{ textDecoration: 'underline' }}>Nome do personagem</strong>: {m.nome}<br />
              <strong style={{ textDecoration: 'underline' }}>Universo</strong>:  {m.universo}<br />
              <strong style={{ textDecoration: 'underline' }}>Escala</strong>: {m.escala}<br />
              <strong style={{ textDecoration: 'underline' }}>Material</strong>: {m.material}<br />
              <strong style={{ textDecoration: 'underline' }}>Marca da Resina/Filamento</strong>: {m.marca}<br />
              <strong style={{ textDecoration: 'underline' }}>Altura</strong>: {m.altura} cm<br />
              <strong style={{ textDecoration: 'underline' }}>Data de Cadastro</strong>: {new Date(m.data_criacao).toLocaleString('pt-BR')}
            </div>

            {/* BOTÕES EDITAR E DELETAR */}
            {/* <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
              <EditButton onClick={() => handleEditClick(m)}
                isHovered={isHovered}
                setIsHovered={setIsHovered} />
              <DeleteButton id={m.id} onDelete={handleDelete}
                isHovered={isHovered}
                setIsHovered={setIsHovered} />
            </div> */}
          </li>
        ))}
      </ul>

      {/* modal de edição simples */}
      <Modal
        open={open}
        // fechar modal ao clicar no botão ou apertar ESC
        onClose={(event, reason) => {
          if (reason === 'escapeKeyDown') {
            setOpen(false);
          }
        }}
        disableEscapeKeyDown={false}
        aria-labelledby="edit-miniatura-modal"
        aria-describedby="basic-edit-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          background: 'rgba(26, 26, 46)',
          color: colors.textLight,


        }}>
          <h2 id="edit-miniatura-modal" style={{ textAlign: "center" }}>Editar Miniatura</h2>
          {selectedMiniatura ? (
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Nome do Personagem"
                value={editFormData.nomeDoPersonagem || ''}
                onChange={(e) => setEditFormData({ ...editFormData, nomeDoPersonagem: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Universo"
                value={editFormData.universo || ''}
                onChange={(e) => setEditFormData({ ...editFormData, universo: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Escala"
                value={editFormData.escala || ''}
                onChange={(e) => setEditFormData({ ...editFormData, escala: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Material"
                value={editFormData.material || ''}
                onChange={(e) => setEditFormData({ ...editFormData, material: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Marca"
                value={editFormData.marca || ''}
                onChange={(e) => setEditFormData({ ...editFormData, marca: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="number"
                placeholder="Altura (cm)"
                value={editFormData.altura || ''}
                onChange={(e) => setEditFormData({ ...editFormData, altura: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              {/* Botões das miniaturas cadastradas */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <CancelButton onCancel={() => setOpen(false)}
                  isHovered={isHovered}
                  setIsHovered={setIsHovered} />
                <AddButton label='Salvar Alterações' isHovered={isHovered} setIsHovered={setIsHovered} />
              </div>
            </form>
          ) : null}
        </Box>
      </Modal>
    </div>
  );
}


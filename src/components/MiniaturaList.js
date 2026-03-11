import React, { useState } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';

export default function MiniaturaList({ miniaturas, onDelete }) {
  const [mensagemDelete, setMensagemDelete] = useState('');
  const [severidade, setSeveridade] = useState('success');

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/miniaturas/${id}`, {
        method: 'DELETE'
      });

      if (onDelete) {
        onDelete(id);
        setMensagemDelete('Miniatura deletada com sucesso!');
        setSeveridade('success');
      }

    } catch (error) {
      console.error("Erro ao deletar miniatura:", error);
      setMensagemDelete('Erro ao deletar miniatura.');
      setSeveridade('error');
    }
  };

  return (
    <div style={{ marginTop: '20px', fontFamily }}>
      {/* Notificação de delete */}
      <Notification
        open={!!mensagemDelete}
        message={mensagemDelete}
        severity={severidade}
        onClose={() => setMensagemDelete('')}
        duration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
              {/* BOTÕES EDITAR E DELETAR 
              TODO: Implementar edição, sem função onClick={() => {}} */}
              
              {/* <button
                onClick={() => {}}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  background: '#0066ff',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 8px #0066ff',
                  transition: '0.3s',
                }}
              >
                Editar
              </button> */}
              {/* BOTÕES EDITAR E DELETAR */}                
              {/* <button
                onClick={() => handleDelete(m.id)}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  background: '#ff0033',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 8px #ff0033',
                  transition: '0.3s',
                }}
              >
                Deletar
              </button> */}
            </div>

          </li>

        ))}
      </ul>
    </div>
  );
}


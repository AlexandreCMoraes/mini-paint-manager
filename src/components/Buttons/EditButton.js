import React, { useState } from 'react';

// Botão de editar, usado na lista de miniaturas para abrir o modal de edição
export default function EditButton({ onClick, label = 'Editar', type = 'button' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '6px 10px',
        border: 'none',
        borderRadius: '5px',
        background: '#0066ff',
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 0 15px #0066ff' : '0 0 10px #0066ff',
        transition: '0.3s',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      {label}
    </button>
  );
}

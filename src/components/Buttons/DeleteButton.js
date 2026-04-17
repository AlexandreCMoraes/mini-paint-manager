import React, { useState } from 'react';

export default function DeleteButton({ id, onDelete, label = 'Deletar' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onDelete(id)}
      style={{
        padding: '6px 10px',
        border: 'none',
        borderRadius: '5px',
        background: '#ff0033',
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 0 15px #ff0033' : '0 0 10px #ff0033',
        transition: '0.3s',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      {label}
    </button>
  );
}

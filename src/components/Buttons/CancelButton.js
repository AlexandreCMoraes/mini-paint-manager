import { colors } from '@mui/material';
import React, { useState } from 'react';

export default function CancelButton({ id, onCancel }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCancel(id)}
      style={{
        padding: '6px 10px',
        border: 'none',
        borderRadius: '5px',
        background: colors.grey[700],
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 0 15px #616161' : '0 0 10px #616161',
        transition: '0.3s',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      Cancelar
    </button>
  );
}

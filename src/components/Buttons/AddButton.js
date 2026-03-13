import React from 'react';
import { colors } from '../../styles/theme';

export default function AddButton({ label, isHovered, setIsHovered }) {
  return (
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
      {label}
    </button>
  );
}

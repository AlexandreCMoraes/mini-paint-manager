import React, { useMemo, useState } from 'react';
import { colors } from '../../styles/theme';

const VARIANT_STYLES = {
    primary: {
        background: colors.primaryButton,
        glow: '#00ffcc',
        padding: '10px'
    },
    secondary: {
        background: '#0066ff',
        glow: '#0066ff',
        padding: '6px 10px'
    },
    danger: {
        background: '#ff0033',
        glow: '#ff0033',
        padding: '6px 10px'
    },
    neutral: {
        background: '#616161',
        glow: '#616161',
        padding: '6px 10px'
    }
};

export default function Button({
    label,
    onClick,
    variant = 'primary',
    style,
    type = 'button'
}) {
    const [isHovered, setIsHovered] = useState(false);
    const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

    const baseStyle = useMemo(() => ({
        padding: variantStyle.padding,
        border: 'none',
        borderRadius: '5px',
        background: variantStyle.background,
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: isHovered
            ? `0 0 15px ${variantStyle.glow}`
            : `0 0 10px ${variantStyle.glow}`,
        transition: '0.3s',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)',
        ...style
    }), [isHovered, style, variantStyle.background, variantStyle.glow, variantStyle.padding]);

    return (
        <button
            type={type}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={baseStyle}
        >
            {label}
        </button>
    );
}

import { colors, fontFamily } from '../styles/theme';

export default function Header() {
  return (
    <header style={{
      background: colors.background,
      color: colors.textLight,
      padding: '20px',
      textAlign: 'center',
      fontFamily,
      fontSize: '2rem',
      textShadow: '0 0 10px #00ffcc',
      borderRadius: '10px',

    }}>
      Mini Paint Manager
    </header>
  );
}

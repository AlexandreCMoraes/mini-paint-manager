import Header from '../components/Header';
import MiniatureForm from '../components/MiniatureForm';
import MiniatureList from '../components/MiniatureList';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import ResponsiveAppBar from '../components/AppBar';
import useMiniatures from '../features/miniatures/hooks/useMiniatures';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, logout } = useAuth();

  const {
    miniaturas,
    addMiniatura,
    deleteMiniaturaFromList,
    updateMiniaturaInList,
  } = useMiniatures({
    isAuthenticated,
    onUnauthorized: logout,
  });

  return (
    <div className="page-shell" style={{
      backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${planoFundo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <ResponsiveAppBar />
      <Header />
      {/* TODO mexido para testes de estilos */}
      <div className="surface">
        <MiniatureForm onAdd={addMiniatura} />
        <MiniatureList
          miniaturas={miniaturas}
          onDelete={deleteMiniaturaFromList}
          onUpdate={updateMiniaturaInList}
          modo="home" />
      </div>
    </div>
  );
}

export default Home;

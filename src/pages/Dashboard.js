import { useEffect, useState } from 'react';
import ResponsiveAppBar from '../components/AppBar';
import MiniaturasLista from '../components/MiniatureList';
import Header from '../components/Header';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { useAuth } from '../context/AuthContext';

// O componente Dashboard é responsável por exibir a lista de miniaturas 
// permitindo que o usuário visualize, edite e delete miniaturas com  mais facilidade.
// Ele busca os dados do backend ao ser montado e atualiza a lista conforme as 
// ações do usuário.
function Dashboard() {
    const [miniaturas, setMiniaturas] = useState([]); // estado da lista de miniaturas
    const { isAuthenticated } = useAuth();

    // Função para buscar miniaturas do backend e atualizar estado
    const fetchMiniaturas = async () => {
        if (!isAuthenticated) return; // Só busca se estiver autenticado

        try {
            const res = await fetch(API_ENDPOINTS.MINIATURAS,
                {
                    headers:
                        getAuthHeaders()
                }
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setMiniaturas(data); // atualiza estado
        } catch (error) {
            console.error('Erro ao buscar miniaturas:', error);
        }
    };

    useEffect(() => { fetchMiniaturas(); }, [isAuthenticated]); // roda quando autenticação muda

    // Quando deletar
    const handleDelete = (id) => {
        setMiniaturas(miniaturas.filter(m => m.id !== id));
    };

    // Quando atualizar
    const handleUpdate = (updatedMini) => {
        setMiniaturas(miniaturas.map(m => m.id === updatedMini.id ? updatedMini : m));
    };

    return (
        <div className="page-shell" style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${planoFundo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh'
        }}>
            <ResponsiveAppBar />
            <Header title="Dashboard" />

            <div>
                {/* Aqui entra sua lista já pronta */}
                <MiniaturasLista miniaturas={miniaturas} onDelete={handleDelete} onUpdate={handleUpdate} modo="dashboard" />
            </div>
        </div>
    );
}

export default Dashboard;

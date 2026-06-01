import { useEffect, useState, useCallback } from 'react';
import ResponsiveAppBar from '../components/AppBar';
import MiniaturasLista from '../components/MiniatureList';
import Header from '../components/Header';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import { listMiniatures } from '../features/miniatures/services';
import { useAuth } from '../context/AuthContext';

// Página de Dashboard para exibir miniaturas do usuário logado, com opções de editar e deletar cada
//  miniatura e também para criar novas miniaturas. A página é protegida, ou seja, só pode ser acessada 
// por usuários autenticados.
function Dashboard() {
    const [miniaturas, setMiniaturas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { isAuthenticated, logout } = useAuth();

    // Função para buscar as miniaturas do usuário logado. Ela é chamada quando o componente é
    //  montado e também sempre que o estado de autenticação mudar. Se o usuário não estiver 
    // autenticado, a lista de miniaturas é limpa e o carregamento é finalizado. Caso contrário, a 
    // função tenta buscar as miniaturas usando a função listMiniatures do serviço. Se a busca for 
    // bem-sucedida, as miniaturas são armazenadas no estado. Se ocorrer um erro, uma mensagem de 
    // erro é exibida. Se o erro for relacionado à autenticação (status 401), o usuário é deslogado.
    const fetchMiniaturas = useCallback(async () => {
        if (!isAuthenticated) {
            setMiniaturas([]);
            setIsLoading(false);
            setErrorMessage('');
            return;
        }

        try {
            setIsLoading(true);

            setErrorMessage('');

            const data = await listMiniatures();
            setMiniaturas(data);

        } catch (error) {
            console.error('Erro ao buscar miniaturas:', error);

            if (String(error?.message).includes('status: 401')) {
                logout();
                return;
            }
            setErrorMessage('Não foi possível carregar as miniaturas. Tente novamente.');
        } finally {
            setIsLoading(false);

        }
    }, [isAuthenticated, logout]);

    useEffect(() => { fetchMiniaturas(); }, [fetchMiniaturas]);

    // Quando deletar
    const handleDelete = (id) => {
        setMiniaturas((prevMiniaturas) =>
            prevMiniaturas.filter((m) =>
                m.id !== id));
    };

    // Quando atualizar
    const handleUpdate = (updatedMini) => {
        setMiniaturas((prevMiniaturas) =>
            prevMiniaturas.map((m) =>
                m.id === updatedMini.id ? updatedMini : m));
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

            {/* Mensagens de carregamento e erro */}
            {isLoading && <p style={{ color: '#fff', textAlign: 'center' }}>Carregando miniaturas...</p>}
            {errorMessage && <p style={{ color: '#ffb4b4', textAlign: 'center' }}>{errorMessage}</p>}

            {!isLoading && !errorMessage && (
                <div>
                    <MiniaturasLista
                        miniaturas={miniaturas}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        modo="dashboard"
                    />
                </div>
            )}

            {/* <div> */}
            {/* Aqui entra sua lista já pronta */}
            {/* <MiniaturasLista miniaturas={miniaturas} onDelete={handleDelete} onUpdate={handleUpdate} modo="dashboard" /> */}
            {/* </div> */}
        </div>
    );
}

export default Dashboard;

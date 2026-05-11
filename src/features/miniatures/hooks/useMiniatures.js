import { useCallback, useEffect, useState } from 'react';
import { listMiniatures } from '../services';

// Hook personalizado para gerenciar miniaturas, incluindo busca, adição, exclusão e atualização, com
// tratamento de autenticação e erros
// centralizar carregamento da lista, mutações locais (add/update/delete) e tratamento de não autorizado (401)
export default function useMiniatures({ isAuthenticated, onUnauthorized }) {
    const [miniaturas, setMiniaturas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMiniaturas = useCallback(async () => {
        if (!isAuthenticated) {
            setMiniaturas([]);
            return;
        }

        setIsLoading(true);
        try {
            const data = await listMiniatures();
            setMiniaturas(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error?.status === 401 && onUnauthorized) {
                onUnauthorized();
                return;
            }
            console.error('Erro ao buscar miniaturas:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, onUnauthorized]);

    useEffect(() => {
        fetchMiniaturas();
    }, [fetchMiniaturas]);

    const addMiniatura = useCallback((newMini) => {
        setMiniaturas((prev) => [...prev, newMini]);
    }, []);

    const deleteMiniaturaFromList = useCallback((id) => {
        setMiniaturas((prev) => prev.filter((m) => m.id !== id));
    }, []);

    const updateMiniaturaInList = useCallback((updatedMini) => {
        setMiniaturas((prev) => prev.map((m) => (m.id === updatedMini.id ? updatedMini : m)));
    }, []);

    return {
        miniaturas,
        isLoading,
        fetchMiniaturas,
        addMiniatura,
        deleteMiniaturaFromList,
        updateMiniaturaInList,
    };
}

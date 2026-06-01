import { useEffect, useState } from 'react';
import { searchMiniatures } from '../services';

// Hook personalizado para buscar miniaturas com debounce e tratamento de erros
export default function useMiniatureSearch(searchValue, searchField) {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResults([]);
            return;
        }

        let isCancelled = false;

        const fetchResults = async () => {
            try {
                const data = await searchMiniatures(searchValue, searchField);
                if (!isCancelled) {
                    setSearchResults(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Erro na busca:', error);
                if (!isCancelled) {
                    setSearchResults([]);
                }
            }
        };

        const delayDebounce = setTimeout(fetchResults, 300);
        return () => {
            isCancelled = true;
            clearTimeout(delayDebounce);
        };
    }, [searchValue, searchField]);

    return {
        searchResults,
        clearSearchResults: () => setSearchResults([]),
    };
}

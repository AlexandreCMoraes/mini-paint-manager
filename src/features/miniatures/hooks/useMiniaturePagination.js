import { useEffect, useRef, useState } from 'react';

// Esse hook gerencia a paginação de miniaturas, ajustando a página atual quando itens são deletados e 
// garantindo que a página seja atualizada corretamente.
export default function useMiniaturePagination(totalItems, itemsPerPage = 10) {
    const [page, setPage] = useState(1);
    const paginationRef = useRef(null);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (!deleted) return; // Se não houve deleção, não precisa ajustar a página.

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (page > totalPages) {
            const newPage = totalPages > 0 ? totalPages : 1;
            setPage(newPage);

            setTimeout(() => {
                paginationRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 300);
        }

        setDeleted(false);
    }, [deleted, page, totalItems, itemsPerPage]);

    return {
        page,
        setPage,
        paginationRef,
        markDeleted: () => setDeleted(true),
        totalPages: Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    };
}

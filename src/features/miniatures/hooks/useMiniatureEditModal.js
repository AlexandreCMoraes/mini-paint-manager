import { useEffect, useState } from 'react';

// Hook para gerenciar o estado e lógica do modal de edição de miniaturas, incluindo abertura a partir de
//  um parâmetro na URL, controle do formulário de edição, e navegação entre abas dentro do modal.
export default function useMiniatureEditModal({ modo, miniaturas, searchParams, setSearchParams }) {
    const [open, setOpen] = useState(false);
    const [selectedMiniatura, setSelectedMiniatura] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [openedFromParam, setOpenedFromParam] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const editIdFromUrl = searchParams.get('editId');

    const buildEditFormData = (miniatura) => ({
        nomeDoPersonagem: miniatura.nome,
        universo: miniatura.universo,
        escala: miniatura.escala,
        material: miniatura.material,
        marca: miniatura.marca,
        altura: miniatura.altura != null ? String(miniatura.altura) : '',
    });

    // Efeito para abrir o modal automaticamente se houver um editId na URL, buscando a miniatura 
    // correspondente e preenchendo o formulário de edição. O efeito depende do modo ser 'dashboard', 
    // da presença do editId, e de não ter sido aberto anteriormente a partir do parâmetro para evitar loops 
    // de abertura.
    useEffect(() => {
        if (modo !== 'dashboard' || !editIdFromUrl || openedFromParam) return;

        const mini = miniaturas.find((m) => String(m.id) === String(editIdFromUrl));
        if (!mini) return;

        setSelectedMiniatura(mini);
        setEditFormData(buildEditFormData(mini));
        setActiveTab(0);
        setOpen(true);
        setOpenedFromParam(true);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('editId');
        setSearchParams(nextParams, { replace: true });
    }, [modo, editIdFromUrl, miniaturas, openedFromParam, searchParams, setSearchParams]);

    const clearEditIdParam = () => {
        if (!editIdFromUrl) return;

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('editId');
        setSearchParams(nextParams, { replace: true });
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedMiniatura(null);
        setActiveTab(0);
        setOpenedFromParam(false);
        clearEditIdParam();
    };

    const openFromMiniature = (mini) => {
        setSelectedMiniatura(mini);
        setEditFormData(buildEditFormData(mini));
        setOpen(true);
    };

    return {
        open,
        setOpen,
        selectedMiniatura,
        editFormData,
        setEditFormData,
        activeTab,
        setActiveTab,
        editIdFromUrl,
        closeModal,
        openFromMiniature,
    };
}

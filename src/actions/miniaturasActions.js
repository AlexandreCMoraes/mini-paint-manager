import { API_ENDPOINTS, NOTIFICATION_TIMEOUT } from '../config/api';

// Função para deletar miniatura
export const handleDeleteMiniatura = async (id, onDelete, setMensagemDelete, setSeveridade) => {
    try {
        const res = await fetch(API_ENDPOINTS.MINIATURA_DELETE(id), {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        if (onDelete) {
            onDelete(id);
            setMensagemDelete('Miniatura deletada com sucesso!');
            setSeveridade('success');
            setTimeout(() => setMensagemDelete(''), NOTIFICATION_TIMEOUT);
        }

    } catch (error) {
        console.error("Erro ao deletar miniatura:", error);
        setMensagemDelete('Erro ao deletar miniatura.');
        setSeveridade('error');
        setTimeout(() => setMensagemDelete(''), NOTIFICATION_TIMEOUT);
    }
};

// placeholder para editar, a lógica de modal fica no componente
export const handleEditMiniatura = (miniatura) => {
    console.log('Editar miniatura:', miniatura);
};

export const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;

    // Validação especial para escala para colocar apenas números e ":" (para escalas como 1:24)
    if (name === 'escala') {
        if (value !== '' && value !== 'N/A' && !/^[\d:]*$/.test(value)) {
            return; // Não aceita valores inválidos
        }
    }

    // Capitalização para material
    if (name === 'material' && value) {
        setFormData({
            ...formData,
            [name]: value.charAt(0).toUpperCase() + value.slice(1)
        });
        return;
    }

    setFormData({
        ...formData,
        [name]: value
    });
};

export const handleSubmitMiniatura = async (e, formData, onAdd, setMensagemSucesso, setMensagemErro, setFormData, INITIAL_FORM_STATE) => {
    e.preventDefault();

    // Validação antes de tudo para garantir que todos os campos estão preenchidos
    if (!formData.nomeDoPersonagem || !formData.universo || !formData.escala ||
        !formData.material || !formData.altura || !formData.marca) {
        setMensagemErro("Por favor, preencha todos os campos antes de adicionar a miniatura!");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    //  Construção do objeto a ser enviado para o backend
    const newMini = {
        nomeDoPersonagem: formData.nomeDoPersonagem,
        universo: formData.universo,
        escala: formData.escala,
        material: formData.material,
        marca: formData.marca,
        altura: parseFloat(formData.altura)
    };

    try {
        const res = await fetch(API_ENDPOINTS.MINIATURAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMini)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Atualiza lista no componente pai 
        if (onAdd) {
            onAdd(data);
        }

        // Mensagem de sucesso
        setMensagemSucesso(`Miniatura "${formData.nomeDoPersonagem}" adicionada com sucesso!`);
        setMensagemErro('');
        setTimeout(() => setMensagemSucesso(''), NOTIFICATION_TIMEOUT);

        // Limpa campos
        setFormData(INITIAL_FORM_STATE);

    } catch (error) {
        console.error("Erro ao salvar miniatura:", error);
        setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
    }
};

export const handleSaveMiniatura = async (e, formData, id, onUpdate, setMensagemSucesso, setMensagemErro, setOpen) => {
    e.preventDefault();

    // Validação antes de tudo para garantir que todos os campos estão preenchidos
    if (!formData.nomeDoPersonagem || !formData.universo || !formData.escala ||
        !formData.material || !formData.altura || !formData.marca) {
        setMensagemErro("Por favor, preencha todos os campos antes de salvar a miniatura!");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    //  Construção do objeto a ser enviado para o backend
    const updatedMini = {
        nomeDoPersonagem: formData.nomeDoPersonagem,
        universo: formData.universo,
        escala: formData.escala,
        material: formData.material,
        marca: formData.marca,
        altura: parseFloat(formData.altura)
    };

    try {
        const res = await fetch(API_ENDPOINTS.MINIATURA_UPDATE(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMini)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Atualiza lista no componente pai e renderiza nova miniatura editada
        if (onUpdate) {
            onUpdate(data.updated); // backend retorna { message, updated }
        }

        // Fecha modal imediatamente
        setOpen(false);

        // Mensagem de sucesso (será mostrada fora do modal)
        setMensagemSucesso(`Miniatura "${formData.nomeDoPersonagem}" atualizada com sucesso!`);
        setTimeout(() => setMensagemSucesso(''), NOTIFICATION_TIMEOUT);

    } catch (error) {
        console.error("Erro ao atualizar miniatura:", error);
        setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
    }
};

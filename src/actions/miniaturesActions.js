import { API_ENDPOINTS, NOTIFICATION_TIMEOUT, getAuthHeaders } from '../config/api';

// Função para deletar miniatura
export const handleDeleteMiniatura = async (id, onDelete, setMensagemDelete, setSeveridade) => {
    try {
        const res = await fetch(API_ENDPOINTS.MINIATURA_DELETE(id), {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            }
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

    // Validação especial para escala: permite somente dígitos e ':' durante a digitação
    // e valida no submit para garantir formato completo (ex: 1:12, 1:24, 2:30)
    if (name === 'escala') {
        const normalized = value.trim().toUpperCase();
        if (normalized !== '' && normalized !== 'N/A' && !/^[\d:]*$/.test(value)) {
            return; // Não aceita caracteres fora de dígitos e ':'
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
// Função para salvar nova miniatura, recebe os dados do formulário e a função de add do componente pai 
// para atualizar a lista, além de funções para mostrar mensagens de sucesso/erro
export const handleSubmitMiniatura = async (e, formData, onAdd, setMensagemSucesso, setMensagemErro, setFormData, INITIAL_FORM_STATE) => {
    e.preventDefault();

    // Validação de campos: altura deve ser um número maior que zero, e 
    // todos os campos obrigatórios devem estar preenchidos
    const alturaNumerica = Number(formData.altura);
    const camposObrigatoriosPreenchidos = [
        formData.nomeDoPersonagem,
        formData.universo,
        formData.escala,
        formData.material,
        formData.marca
    ].every((campo) => typeof campo === 'string' && campo.trim() !== '');

    // Validação antes de tudo para garantir que todos os campos estão preenchidos
    // if (!formData.nomeDoPersonagem || !formData.universo || !formData.escala ||
    //     !formData.material || !formData.altura || !formData.marca) {
    if (!camposObrigatoriosPreenchidos || Number.isNaN(alturaNumerica)) {
        setMensagemErro("Por favor, preencha todos os campos antes de adicionar a miniatura!");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }
    if (alturaNumerica <= 0) {
        setMensagemErro('A altura deve ser um número maior que zero.');
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }


    //  Validação da escala no submit: deve ser no formato d+:d+ (ex: 1:12, 1:24) ou N/A
    const escalaPattern = /^\d+:\d+$/;
    if (!(escalaPattern.test(formData.escala) || formData.escala.trim().toUpperCase() === 'N/A')) {
        setMensagemErro('A escala deve estar no formato 1:12, 1:24, etc., ou N/A.');
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    //  Construção do objeto a ser enviado para o backend (backend espera nomeDoPersonagem, universo, 
    // escala, material, marca, altura)
    const newMini = {
        nomeDoPersonagem: formData.nomeDoPersonagem,
        universo: formData.universo,
        escala: formData.escala,
        material: formData.material,
        marca: formData.marca,
        // altura: parseFloat(formData.altura)
        altura: alturaNumerica
    };

    try {
        const res = await fetch(API_ENDPOINTS.MINIATURAS, {
            method: 'POST',
            // inclui token de autenticação no header para rotas protegidas do backend que 
            // exigem autenticação para criar novas miniaturas (rota POST /miniaturas é
            //  protegida) - o token é obtido da função getAuthHeaders que lê o token do 
            // localStorage e retorna o header Authorization com o token, e é espalhado 
            // junto com o header Content-Type para garantir que ambos sejam enviados na 
            // requisição
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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
// Função para salvar miniatura editada, recebe o id da miniatura, os dados do formulário e a função de 
// update do componente pai para atualizar a lista
export const handleSaveMiniatura = async (e, formData, id, onUpdate, setMensagemSucesso, setMensagemErro, setOpen) => {
    e.preventDefault();

    const alturaNumerica = Number(formData.altura);
    const camposObrigatoriosPreenchidos = [
        formData.nomeDoPersonagem,
        formData.universo,
        formData.escala,
        formData.material,
        formData.marca
    ].every((campo) => typeof campo === 'string' && campo.trim() !== '');

    // Validação antes de tudo para garantir que todos os campos estão preenchidos
    if (!camposObrigatoriosPreenchidos || Number.isNaN(alturaNumerica)) {
        setMensagemErro("Por favor, preencha todos os campos antes de salvar a miniatura!");
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }
    if (alturaNumerica <= 0) {
        setMensagemErro('A altura deve ser um número maior que zero.');
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    //  Validação da escala no submit: deve ser no formato d+:d+ (ex: 1:12, 1:24) ou N/A
    const escalaPattern = /^\d+:\d+$/;
    if (!(escalaPattern.test(formData.escala) || formData.escala.trim().toUpperCase() === 'N/A')) {
        setMensagemErro('A escala deve estar no formato 1:12, 1:24, etc., ou N/A.');
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
        // altura: parseFloat(formData.altura)
        altura: alturaNumerica
    };

    try {
        const res = await fetch(API_ENDPOINTS.MINIATURA_UPDATE(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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

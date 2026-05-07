import { NOTIFICATION_TIMEOUT } from '../config/api';
import { buildMiniaturePayload, validateMiniaturePayload } from '../features/miniatures/validation';
import { createMiniature, deleteMiniature, updateMiniature } from '../features/miniatures/services';
// Função para deletar miniatura
export const handleDeleteMiniatura = async (id, onDelete, setMensagemDelete, setSeveridade) => {
    try {
        await deleteMiniature(id);

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
// Função para salvar nova miniatura, recebe os dados do formulário e a função de add do 
// componente pai para atualizar a lista com a nova miniatura criada, além de funções 
// para mostrar mensagens de sucesso ou erro e para limpar os campos do formulário
//  após o sucesso na criação (setFormData com estado inicial)
export const handleSubmitMiniatura = async (e, formData, onAdd, setMensagemSucesso, setMensagemErro, setFormData, INITIAL_FORM_STATE) => {
    e.preventDefault();

    const validation = validateMiniaturePayload(formData, 'create');
    if (!validation.ok) {
        setMensagemErro(validation.message);
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    const newMini = buildMiniaturePayload(formData, validation.alturaNumerica);

    try {
        const data = await createMiniature(newMini);

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

    const validation = validateMiniaturePayload(formData, 'update');
    if (!validation.ok) {
        setMensagemErro(validation.message);
        setTimeout(() => setMensagemErro(''), NOTIFICATION_TIMEOUT);
        return;
    }

    const updateMini = buildMiniaturePayload(formData, validation.alturaNumerica);

    try {
        const data = await updateMiniature(id, updateMini);

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

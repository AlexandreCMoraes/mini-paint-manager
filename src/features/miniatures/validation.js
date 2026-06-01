export const SCALE_PATTERN = /^\d+:\d+$/;

// Valida os dados do formulário de miniatura, garantindo que todos os campos obrigatórios 
// estejam preenchidos, a altura seja um número positivo e a escala esteja no formato 
// correto ou seja "N/A".
export const validateMiniaturePayload = (formData, mode = 'update') => {
    const alturaNumerica = Number(formData.altura);
    const camposObrigatoriosPreenchidos = [
        formData.nomeDoPersonagem,
        formData.universo,
        formData.escala,
        formData.material,
        formData.marca,
    ].every((campo) => typeof campo === 'string' && campo.trim() !== '');

    if (!camposObrigatoriosPreenchidos || Number.isNaN(alturaNumerica)) {
        return {
            ok: false,
            message: mode === 'create'
                ? 'Por favor, preencha todos os campos antes de adicionar a miniatura!'
                : 'Por favor, preencha todos os campos antes de salvar a miniatura!',
        };
    }

    if (alturaNumerica <= 0) {
        return {
            ok: false,
            message: 'A altura deve ser um número maior que zero.',
        };
    }

    if (!(SCALE_PATTERN.test(formData.escala) || formData.escala.trim().toUpperCase() === 'N/A')) {
        return {
            ok: false,
            message: 'A escala deve estar no formato 1:12, 1:24, etc., ou N/A.',
        };
    }

    return { ok: true, alturaNumerica };
};

export const buildMiniaturePayload = (formData, alturaNumerica) => ({
    nomeDoPersonagem: formData.nomeDoPersonagem,
    universo: formData.universo,
    escala: formData.escala,
    material: formData.material,
    marca: formData.marca,
    altura: alturaNumerica,
});

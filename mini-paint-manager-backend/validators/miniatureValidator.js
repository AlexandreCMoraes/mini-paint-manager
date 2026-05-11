const validateMiniaturePayload = (payload = {}) => {
    // Validação dos campos obrigatórios e do formato da escala. Ele verifica se todos os campos necessários estão presentes e se a altura é um número válido. 
    // Além disso, ele valida o formato da escala, permitindo apenas formatos como "1:12", "1:24" ou "N/A". 
    // Se alguma validação falhar, ele retorna um objeto indicando o status de erro e a mensagem correspondente. 
    // Caso todas as validações sejam bem-sucedidas, ele retorna um objeto indicando que a validação foi bem-sucedida, juntamente com os valores validados.
    const { nomeDoPersonagem, universo, escala, material, marca, altura } = payload;
    const alturaNumerica = Number(altura);

    if (!nomeDoPersonagem || !universo || !escala || !material || !marca || Number.isNaN(alturaNumerica)) {
        return { ok: false, status: 400, message: 'Todos os campos são obrigatórios' };
    }

    if (alturaNumerica <= 0) {
        return { ok: false, status: 400, message: 'A altura deve ser maior que zero' };
    }

    const escalaPattern = /^\d+:\d+$/;
    if (!(escalaPattern.test(escala) || escala.trim().toUpperCase() === 'N/A')) {
        return { ok: false, status: 400, message: 'A escala deve estar no formato 1:12, 1:24, etc., ou N/A.' };
    }

    return {
        ok: true,
        value: {
            nomeDoPersonagem,
            universo,
            escala,
            material,
            marca,
            alturaNumerica,
        },
    };
};

module.exports = {
    validateMiniaturePayload,
};

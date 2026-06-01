const nodemailer = require('nodemailer');

const buildMailTransporter = () => {
    const smtpService = process.env.SMTP_SERVICE;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

    return nodemailer.createTransport({
        ...(smtpService ? { service: smtpService } : {}),
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
};

const sendReactivationEmail = async ({ to, username }) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return { sent: false, reason: 'missing_smtp_config' };
    }

    const mailTransporter = buildMailTransporter();
    const loginUrl = process.env.REACTIVATION_LOGIN_URL || 'http://localhost:3000/login?forceLogin=1';

    await mailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Solicitação de reativação de conta',
        text: [
            'Assunto: 👋 Sentimos sua falta no Mini Paint Manager',
            '',
            `Olá, ${username}!`,
            '',
            'Notamos que sua conta foi desativada — mas suas miniaturas, cores e histórico continuam salvos com a gente.',
            'Para reativar sua conta, clique no link abaixo:',
            loginUrl,
            '',
            '🔐 Por segurança, você precisará redefinir sua senha usando a opção "Forgot Password" após acessar o sistema.',
            '💡 O que você vai recuperar ao voltar:',
            '• Suas miniaturas cadastradas  ',
            '• Suas paletas de cores personalizadas  ',
            '• Seu histórico de uso e preferências  ',
            '',
            'Se você não solicitou essa reativação, pode ignorar este email — sua conta permanecerá desativada.',
            'Esperamos te ver de volta em breve 🎨',
            '',
            ' — Mini Paint Manager'
        ].join('\n'),
    });

    return { sent: true };
};

const sendWelcomeEmail = async ({ to, username }) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return { sent: false, reason: 'missing_smtp_config' };
    }

    const mailTransporter = buildMailTransporter();
    const dashboardUrl = process.env.WELCOME_DASHBOARD_URL || 'http://localhost:3000/dashboard';

    await mailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: '🎨 Bem-vindo ao Mini Paint Manager!',
        text: [
            `Olá, ${username}! 👋`,
            '',
            'Seja bem-vindo ao Mini Paint Manager — seu espaço para organizar e evoluir suas pinturas.',
            '',
            'Aqui você pode:',
            '',
            '🧩 Gerenciar suas miniaturas',
            '🎨 Criar e salvar paletas de cores',
            '📸 Acompanhar evolução das pinturas',
            '🧪 Testar combinações e técnicas',
            '',
            '---',
            '',
            '👉 Comece agora acessando:',
            dashboardUrl,
            '',
            '---',
            '',
            '💡 Dica:',
            'Para adicionar imagens e editar todos os detalhes, acesse o Dashboard.',
            '',
            '---',
            '',
            'Se precisar de ajuda, estamos por aqui!',
            '',
            'Boas pinturas 🎨🔥',
            '— Mini Paint Manager',
        ].join('\n'),
    });

    return { sent: true };
};

module.exports = {
    buildMailTransporter,
    sendReactivationEmail,
    sendWelcomeEmail,
};

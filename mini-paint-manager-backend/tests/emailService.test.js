const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const servicePath = path.resolve(__dirname, '../services/emailService.js');
const nodemailerPath = require.resolve('nodemailer');

const originalEnv = { ...process.env };

const loadServiceWithSendMailMock = (sendMailImpl = async () => { }) => {
    const sendMail = sendMailImpl;
    const createTransport = () => ({ sendMail });

    require.cache[nodemailerPath] = {
        id: nodemailerPath,
        filename: nodemailerPath,
        loaded: true,
        exports: { createTransport },
    };

    delete require.cache[servicePath];
    const emailService = require(servicePath);

    return { emailService, sendMail };
};

test.afterEach(() => {
    process.env = { ...originalEnv };
    delete require.cache[servicePath];
    delete require.cache[nodemailerPath];
});

test('sendWelcomeEmail retorna missing_smtp_config sem credenciais SMTP', async () => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const { emailService } = loadServiceWithSendMailMock();
    const result = await emailService.sendWelcomeEmail({ to: 'ana@mail.com', username: 'ana' });

    assert.deepEqual(result, { sent: false, reason: 'missing_smtp_config' });
});

test('sendWelcomeEmail envia email e retorna sent=true', async () => {
    process.env.SMTP_USER = 'no-reply@mail.com';
    process.env.SMTP_PASS = 'secret';

    const calls = [];
    const { emailService } = loadServiceWithSendMailMock(async (payload) => {
        calls.push(payload);
    });

    const result = await emailService.sendWelcomeEmail({ to: 'ana@mail.com', username: 'ana' });

    assert.equal(result.sent, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].to, 'ana@mail.com');
    assert.match(calls[0].subject, /Bem-vindo/);
});

test('sendReactivationEmail envia email e retorna sent=true', async () => {
    process.env.SMTP_USER = 'no-reply@mail.com';
    process.env.SMTP_PASS = 'secret';

    const calls = [];
    const { emailService } = loadServiceWithSendMailMock(async (payload) => {
        calls.push(payload);
    });

    const result = await emailService.sendReactivationEmail({ to: 'bob@mail.com', username: 'bob' });

    assert.equal(result.sent, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].to, 'bob@mail.com');
    assert.match(calls[0].subject, /reativação/);
});

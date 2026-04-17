import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import ResponsiveAppBar from '../components/AppBar';
import Header from '../components/Header';
import Button from '../components/Buttons/Button';

function Profile() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSalvar = (event) => {
    event.preventDefault();
  };

  const handleCancelar = () => {
    setNome('');
    setEmail('');
    setSenha('');
    navigate('/home');
  };

  const handleDeleteConta = () => {
  };

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${planoFundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <ResponsiveAppBar />
      <Header />

      <div className="surface perfil-surface">
        <h2 className="perfil-title">Perfil</h2>

        <form className="perfil-form" onSubmit={handleSalvar}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="perfil-actions">
            <Button
              type="submit"
              label="Salvar"
              variant="primary"
            />
            <Button onCancel={handleCancelar} label="Cancelar" variant='neutral'/>
            <Button onDelete={handleDeleteConta} label="Deletar conta" variant='danger'/>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;

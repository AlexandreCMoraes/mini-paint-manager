import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import planoFundo from '../img/plano-de-fundo-v2.jpeg';
import ResponsiveAppBar from '../components/AppBar';
import Header from '../components/Header';
import Button from '../components/Buttons/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Snapshot inicial para o botão cancelar restaurar o que veio da sessão
  const [initialData, setInitialData] = useState({ nome: '', email: '' });

  useEffect(() => {
    const nomeUsuario = user?.username || '';
    const emailUsuario = user?.email || '';

    setNome(nomeUsuario);
    setEmail(emailUsuario);
    setSenha('');
    setInitialData({ nome: nomeUsuario, email: emailUsuario });
  }, [user]);


  const handleSalvar = (event) => {
    event.preventDefault();
  };

  // O botão cancelar simplesmente restaura os valores para o que veio da sessão, sem fazer nenhuma 
  // chamada à API, e redireciona para a página inicial.
  const handleCancelar = () => {
    setNome(initialData.nome);
    setEmail(initialData.email);
    setSenha('');
    navigate('/home');
  };

  // O botão de deletar conta faz uma chamada à API para desativar a conta do usuário autenticado, e 
  // em caso de sucesso, limpa a sessão e redireciona para a página de login com uma mensagem de 
  // confirmação. Ele também tem um estado de "isDeleting" para evitar múltiplos cliques enquanto a 
  // requisição está em andamento.
  const handleDeleteConta = async () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await fetch(API_ENDPOINTS.USER_ME, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao desativar conta');
      }

      logout();
      navigate('/login', {
        replace: true,
        state: {
          accountDeactivated: true,
          accountDeactivatedMessage: 'Sua conta foi desativada com sucesso',
        },
      });
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
      window.alert(error.message || 'Não foi possível desativar sua conta. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handeMudarSenha = () => {
    navigate('/forgot-password', {
      state: {
        forgotPassword: true,
        step: 2,
        email,
      },
    });
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
            <Button onClick={handleCancelar} label="Cancelar" variant='neutral' />
            <Button onClick={handleDeleteConta} label={isDeleting ? 'Desativando...' : 'Deletar conta'} variant='danger' />
            <Button onClick={handeMudarSenha} label="Mudar senha" variant='secondary' />
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Desativar Conta"
        message={
          <>
            Tem certeza que deseja desativar sua conta?
            <br /><br />
            Você perderá o acesso imediatamente, mas seus dados serão preservados para segurança e histórico.
          </>
        }
        confirmLabel={isDeleting ? 'Desativando...' : 'Confirmar'}
        cancelLabel="Cancelar"
        confirmVariant="danger"
        cancelVariant="neutral"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Profile;

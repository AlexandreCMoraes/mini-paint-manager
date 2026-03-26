import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { colors, fontFamily } from '../styles/theme';
import Notification from './Notification';
import DeleteButton from './Buttons/DeleteButton';
import EditButton from './Buttons/EditButton';
import CancelButton from './Buttons/CancelButton';
import AddButton from './Buttons/AddButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { handleDeleteMiniatura, handleSaveMiniatura, handleInputChange } from '../actions/miniaturasActions';
// Opções para os campos de edição, importados do mesmo arquivo utilizado no cadastro para manter 
// consistência e facilitar futuras atualizações
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../data/formOptions';

export default function MiniaturaList({ miniaturas, onDelete, onUpdate }) {
  // Estados para modal de edição da miniatura
  const [open, setOpen] = useState(false);
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  // Estados para notificações
  const [mensagemDelete, setMensagemDelete] = useState('');
  const [severidade, setSeveridade] = useState('success');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  // Estados para paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  // Referência para o componente de paginação, caso seja necessário manipular diretamente 
  // (ex: resetar para a página 1 após uma ação)
  const paginationRef = useRef(null);
  // Estado para marcar se houve um delete, utilizado para acionar o useEffect que ajusta a 
  // página atual após deletar itens
  const [deleted, setDeleted] = useState(false);
  // Handle para deletar miniatura
  const handleDelete = (id) => {
    handleDeleteMiniatura(id, onDelete, setMensagemDelete, setSeveridade);
    setDeleted(true);// marca que houve um delete
  };

  // clicar em editar abre modal
  const handleEditClick = (mini) => {
    setSelectedMiniatura(mini);
    setEditFormData({
      nomeDoPersonagem: mini.nome,
      universo: mini.universo,
      escala: mini.escala,
      material: mini.material,
      marca: mini.marca,
      altura: mini.altura.toString()
    });
    setOpen(true);
  };
  // Garantir que a página atual seja válida mesmo após deletar itens (ex: se estiver na página 3 e 
  // deletar itens que reduzem o total para 2 páginas, volta para a página 2)
  useEffect(() => {
    if (!deleted) return; // só continua se for um delete (estava acionando o use effect ao dar f5 antes)

    const totalPages = Math.ceil(miniaturas.length / itemsPerPage);
    if (page > totalPages) {
      const newPage = totalPages > 0 ? totalPages : 1;
      setPage(newPage);

      // Scroll suave para o componente de paginação após ajustar a página
      setTimeout(() => {
        paginationRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [miniaturas, page]);

  // salvar edição
  const handleSave = (e) => handleSaveMiniatura(e, editFormData, selectedMiniatura.id, onUpdate, setMensagemSucesso, setMensagemErro, setOpen, setSeveridade);

  // Handle para mudanças nos campos do modal de edição (mantém validações de MiniaturaForm)
  // Validação especial para escala para colocar apenas números e ":" (para escalas como 1:24)
  // A mesma logica utilizada no cadastro é aplicada aqui
  const handleChange = (e) => handleInputChange(e, editFormData, setEditFormData);
  // Lógica de paginação - inverte a ordem das miniaturas para mostrar as mais recentes primeiro e 
  // depois aplica a lógica de paginação
  const miniaturasOrdenadas = miniaturas.slice().reverse();
  // Cálculo dos índices para a paginação
  const indexOfLastItem = page * itemsPerPage;
  // O índice do primeiro item é calculado subtraindo o número de itens por página do índice do último item
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // O array de miniaturas é fatiado para obter apenas os itens que devem ser exibidos na página atual
  const currentItems = miniaturasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ marginTop: '20px', fontFamily }}>
      {/* Notificação de delete */}
      <Notification
        open={!!mensagemDelete}
        message={mensagemDelete}
        severity={severidade}
        onClose={() => setMensagemDelete('')}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      {/* Notificação de sucesso de edição */}
      <Notification
        open={!!mensagemSucesso}
        message={mensagemSucesso}
        severity="success"
        onClose={() => setMensagemSucesso('')}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <h2 style={{
        color: colors.primaryButton,
        textAlign: 'center',
        textShadow: '0 0 5px #00ffcc'
      }}>Miniaturas Cadastradas</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentItems.map(m => (
          <li key={m.id} style={{
            background: 'rgba(26, 26, 46, 0.8)',
            color: colors.textLight,
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px #00ffcc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            <div>
              <strong style={{ textDecoration: 'underline' }}>Nome do personagem</strong>: {m.nome}<br />
              <strong style={{ textDecoration: 'underline' }}>Universo</strong>:  {m.universo}<br />
              <strong style={{ textDecoration: 'underline' }}>Escala</strong>: {m.escala}<br />
              <strong style={{ textDecoration: 'underline' }}>Material</strong>: {m.material}<br />
              <strong style={{ textDecoration: 'underline' }}>Marca da Resina/Filamento</strong>: {m.marca}<br />
              <strong style={{ textDecoration: 'underline' }}>Altura</strong>: {m.altura} cm<br />
              <strong style={{ textDecoration: 'underline' }}>Data de Cadastro</strong>: {new Date(m.data_criacao).toLocaleString('pt-BR')}
            </div>

            {/* BOTÕES EDITAR E DELETAR */}
            <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
              <EditButton onClick={() => handleEditClick(m)}
                isHovered={isHovered}
                setIsHovered={setIsHovered} />
              <DeleteButton id={m.id} onDelete={handleDelete}
                isHovered={isHovered}
                setIsHovered={setIsHovered} />
            </div>
          </li>
        ))}
      </ul>

      {/* Paginação */}
      <Stack ref={paginationRef}
        spacing={2}
        alignItems="center"
        style={{ marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(miniaturas.length / itemsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Stack>

      {/* modal de edição simples */}
      <Modal
        open={open}
        // fechar modal ao clicar no botão ou apertar ESC
        onClose={(event, reason) => {
          if (reason === 'escapeKeyDown') {
            setOpen(false);
          }
        }}
        disableEscapeKeyDown={false}
        aria-labelledby="edit-miniatura-modal"
        aria-describedby="basic-edit-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          background: 'rgba(26, 26, 46)',
          color: colors.textLight,


        }}>
          <h2 id="edit-miniatura-modal" style={{ textAlign: "center" }}>Editar Miniatura</h2>
          {selectedMiniatura ? (
            <form onSubmit={handleSave}>
              <input
                type="text"
                name="nomeDoPersonagem"
                placeholder="Nome do Personagem"
                value={editFormData.nomeDoPersonagem || ''}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <input
                type="text"
                name="universo"
                placeholder="Universo"
                value={editFormData.universo || ''}
                onChange={handleChange}
                list="universos"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <datalist id="universos">
                {universoOptions.map((universo, index) => (
                  <option key={index} value={universo} />
                ))}
              </datalist>
              <input
                type="text"
                name="escala"
                placeholder="Escala"
                value={editFormData.escala || ''}
                onChange={handleChange}
                list="escalas"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <datalist id="escalas">
                {escalasOptions.map((escala, index) => (
                  <option key={index} value={escala} />
                ))}
              </datalist>
              <input
                type="text"
                name="material"
                placeholder="Material"
                value={editFormData.material || ''}
                onChange={handleChange}
                list="materiais"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <datalist id="materiais">
                {materiaisOptions.map((mat, index) => (
                  <option key={index} value={mat} />
                ))}
              </datalist>
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                value={editFormData.marca || ''}
                onChange={handleChange}
                list="marcas"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              <datalist id="marcas">
                {marcasOptions.map((marca, index) => (
                  <option key={index} value={marca} />
                ))}
              </datalist>
              <input
                type="number"
                name="altura"
                placeholder="Altura (cm)"
                value={editFormData.altura || ''}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
              {/* Botões das miniaturas cadastradas */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <CancelButton onCancel={() => setOpen(false)}
                  isHovered={isHovered}
                  setIsHovered={setIsHovered} />
                <AddButton label='Salvar Alterações' isHovered={isHovered} setIsHovered={setIsHovered} />
              </div>
            </form>
          ) : null}
        </Box>
      </Modal>
    </div>
  );
}


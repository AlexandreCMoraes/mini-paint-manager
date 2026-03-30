import { useState, useRef, useEffect } from 'react';
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
import TextField from '@mui/material/TextField';
import { handleDeleteMiniatura, handleSaveMiniatura, handleInputChange } from '../actions/miniaturasActions';
import { API_ENDPOINTS } from '../config/api';

// Opções para os campos de edição, importados do mesmo arquivo utilizado no cadastro para manter 
// consistência e facilitar futuras atualizações
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../data/formOptions';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
  const itemsPerPage = 10;
  // Referência para o componente de paginação, caso seja necessário manipular diretamente 
  // (ex: resetar para a página 1 após uma ação)
  const paginationRef = useRef(null);
  // Estado para marcar se houve um delete, utilizado para acionar o useEffect que ajusta a 
  // página atual após deletar itens
  const [deleted, setDeleted] = useState(false);
  // Handle para deletar miniatura

  // Estados de busca e resultados da busca para filtrar a lista de miniaturas exibida conforme o 
  // usuário digita.
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    // setDeleted(false); // resetar flag
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

  // se tiver busca, usa bord results, senão usa paginação
  const listToRender = searchValue.trim().length > 0 ? searchResults : currentItems;

  // Título da página que muda dinamicamente conforme o valor do input de busca e os resultados 
  // encontrados, para dar um feedback visual ao usuário sobre o que está sendo exibido
  const pageTitle = searchValue.trim().length > 0
    ? (searchResults.length > 0 ? 'Miniaturas encontradas' : 'Nenhuma miniatura encontrada')
    : 'Miniaturas Cadastradas';

  // Busca por nome do personagem
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }
    // Função para buscar resultados no backend usando o endpoint de busca 
    // simples, que retorna miniaturas
    const fetchResults = async () => {
      try {
        // Busca no backend usando o endpoint de busca simples, que retorna miniaturas
        const response = await fetch(`${API_ENDPOINTS.MINIATURAS}/search?search=${encodeURIComponent(searchValue)}`);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Erro na busca:', err);
        setSearchResults([]);
      }
    };
    // Debounce para evitar muitas requisições ao backend enquanto o usuário digita, só busca após 300ms
    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  // Limpar busca
  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
  };
  // Lista a renderizar: resultados de busca ou itens da página atual
  // const listToRender = searchValue.trim() ? searchResults : currentItems;

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
      {/* Busca autocomplete somente por nomes */}
      {/*TODO Fazer Busca autocomplete por outros campos */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '15px'
      }}>
        <label style={{
          marginBottom: '5px',
          fontWeight: 'bold',
          color: colors.primaryButton
        }}>Buscar Miniaturas:</label>
        <div style={{ display: 'flex', gap: '5px' }}>

          <input
            type="text"
            // placeholder=""
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              padding: '8px',
              width: '300px',
              borderRadius: '6px',
              border: `1px solid ${colors.primaryButton}`,
              background: 'rgba(26,26,46,0.8)',
              color: colors.textLight
            }}
          />
          <button
            onClick={clearSearch}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: colors.primaryButton,
              color: '#000',
              cursor: 'pointer'
            }}
          >
            X
          </button></div>

        {/* Lista de sugestões autocomplete */}
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '5px',
            width: '300px',
            background: 'rgba(0,0,0,0.85)',
            color: colors.textLight,
            borderRadius: '6px',
            boxShadow: '0 0 8px #00ffcc',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '5px'
          }}>
            {searchResults.map((res) => (
              <div key={res.id} style={{ borderBottom: '1px solid #00ffcc', padding: '5px 0' }}>
                <div><strong>Nome:</strong> {res.nome}</div>
                <div><strong>Universo:</strong> {res.universo}</div>
                <div><strong>Escala:</strong> {res.escala}</div>
                <div><strong>Material:</strong> {res.material}</div>
                <div><strong>Marca:</strong> {res.marca}</div>
                <div><strong>Altura:</strong> {res.altura} cm</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 style={{
        color: colors.primaryButton,
        textAlign: 'center',
        textShadow: '0 0 5px #00ffcc',
        marginBottom: '20px'
      }}>{pageTitle}</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listToRender.map(m => (
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
                pattern="^\d+:\d+$"
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                title="A escala deve ser do formato 1:12, 1:24, etc (número:número). Indica o tamanho da 
                miniatura em relação ao objeto real"
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


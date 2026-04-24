import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './MiniatureList.module.css';
import Notification from './Notification';
import Button from './Buttons/Button';
import MiniatureModal from './MiniatureModal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { handleDeleteMiniatura, handleSaveMiniatura, handleInputChange } from '../actions/miniaturesActions';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

// Opções para os campos de edição, importados do mesmo arquivo utilizado no cadastro para manter 
// consistência e facilitar futuras atualizações
import {
  marcasOptions,
  universoOptions,
  escalasOptions,
  materiaisOptions
} from '../features/miniatures/formOptions';

// Configurações para o campo de busca, permitindo que o usuário escolha por qual campo deseja buscar, 
// e mapeando para os campos do backend
const SEARCH_FIELD_OPTIONS = [
  { value: 'nome', label: 'Nome' },
  { value: 'universo', label: 'Universo' },
  { value: 'escala', label: 'Escala' },
  { value: 'material', label: 'Material' },
  { value: 'marcaResina', label: 'Marca da Resina' },
  { value: 'altura', label: 'Altura' }
];

const API_FIELD_BY_SEARCH_FIELD = {
  nome: 'nome',
  universo: 'universo',
  escala: 'escala',
  material: 'material',
  marcaResina: 'marca',
  altura: 'altura'
};

export default function MiniaturaList({ miniaturas, onDelete, onUpdate, modo = 'home' }) {
  // Estados para modal de edição da miniatura
  const [open, setOpen] = useState(false);
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openedFromParam, setOpenedFromParam] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Estado para a aba ativa no modal
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Pega o editId da URL para abrir o modal de edição se o 
  // usuário clicar em editar no dashboard, que redireciona para a home 
  // com o editId na URL. O useEffect que abre o modal de edição verifica 
  // esse parâmetro e abre o modal com os dados da miniatura correspondente, 
  // permitindo a edição mesmo sem estar no dashboard.
  const editIdFromUrl = searchParams.get('editId');

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
  const [searchField, setSearchField] = useState('nome');
  const [searchResults, setSearchResults] = useState([]);

  // FUNÇÃO PARA DESTACAR TEXTO BUSCADO
  // Divide o texto e aplica estilo apenas na parte que bate com a busca
  const highlightText = (text, highlight, field) => {
    // Se não tiver highlight ou for vazio, retorna o texto normal sem destacar
    if (!highlight || highlight.trim() === '') return text;

    if (field !== searchField) return text; // só destaca se for o campo selecionado na busca

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = String(text).split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase()
        ? <span key={index} className={styles.highlightText}>{part}</span>
        : part
    );
  };

  const handleDelete = (id) => {
    handleDeleteMiniatura(id, onDelete, setMensagemDelete, setSeveridade);
    setDeleted(true);// marca que houve um delete
  };

  // clicar em editar abre modal
  const handleEditClick = (mini) => {
    const newEditData = {
      nomeDoPersonagem: mini.nome,
      universo: mini.universo,
      escala: mini.escala,
      material: mini.material,
      marca: mini.marca,
      altura: mini.altura != null ? String(mini.altura) : '' // lidar com caso de altura ser null ou undefined
    };
    // Se estiver no dashboard, abre o modal de edição simples. Se estiver na 
    // home, redireciona para a home com o editId na URL para abrir o modal de 
    // edição com os dados da miniatura correspondente, permitindo a edição 
    // mesmo sem estar no dashboard.
    if (modo === 'dashboard') {
      setSelectedMiniatura(mini);
      setEditFormData(newEditData);
      setOpen(true);
      return;
    }

    navigate(`/dashboard?editId=${mini.id}`);
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
  }, [deleted, miniaturas, page]);

  // Abrir modal de edição se editId estiver presente na URL e 
  // modo for dashboard, para permitir edição
  useEffect(() => {
    if (modo !== 'dashboard' || !editIdFromUrl || openedFromParam) return;

    const mini = miniaturas.find((m) => String(m.id) === String(editIdFromUrl));
    if (!mini) return;

    setSelectedMiniatura(mini);
    setEditFormData({
      nomeDoPersonagem: mini.nome,
      universo: mini.universo,
      escala: mini.escala,
      material: mini.material,
      marca: mini.marca,
      altura: mini.altura != null ? String(mini.altura) : ''
    });
    setActiveTab(0); // Define a aba como "Dados Básicos" ao abrir via URL
    setOpen(true);
    setOpenedFromParam(true);
  }, [modo, editIdFromUrl, miniaturas, openedFromParam]);

  // salvar edição
  const handleSave = (e) => handleSaveMiniatura(e, editFormData, selectedMiniatura.id, onUpdate, setMensagemSucesso, setMensagemErro, setOpen, setSeveridade);

  // Handle para mudanças nos campos do modal de edição (mantém validações de MiniaturaForm)
  // Validação especial para escala para colocar apenas números e ":" (para escalas como 1:24)
  // A mesma logica utilizada no cadastro é aplicada aqui
  const handleChange = (e) => handleInputChange(e, editFormData, setEditFormData);
  // Ordenação por atividade mais recente: prioriza data de modificação e, na ausência, data de criação.
  // Isso garante que itens recém-editados também apareçam primeiro na lista.
  const getActivityTimestamp = (mini) => {
    const rawDate = mini?.data_modificacao || mini?.data_criacao;
    const parsed = rawDate ? new Date(rawDate).getTime() : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const miniaturasOrdenadas = [...miniaturas].sort((a, b) => {
    const diff = getActivityTimestamp(b) - getActivityTimestamp(a);
    if (diff !== 0) return diff;
    return Number(b.id || 0) - Number(a.id || 0);
  });
  // const miniaturasOrdenadas = [...miniaturas].sort(
  //   (a, b) => new Date(b.data_criacao) - new Date(a.data_criacao)
  // );
  // Cálculo dos índices para a paginação
  const indexOfLastItem = page * itemsPerPage;
  // O índice do primeiro item é calculado subtraindo o número de itens por página do índice do último item
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // O array de miniaturas é fatiado para obter apenas os itens que devem ser exibidos na página atual
  const currentItems = miniaturasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

  // Se houver busca, também ordena os resultados por atividade mais recente.
  const sortedSearchResults = [...searchResults].sort((a, b) => {
    const diff = getActivityTimestamp(b) - getActivityTimestamp(a);
    if (diff !== 0) return diff;
    return Number(b.id || 0) - Number(a.id || 0);
  });

  const listToRender = searchValue.trim().length > 0 ? sortedSearchResults : currentItems;

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
        const apiSearchField = API_FIELD_BY_SEARCH_FIELD[searchField] || 'nome';
        // Busca no backend usando o endpoint de busca simples, que retorna miniaturas
        const response = await fetch(
          `${API_ENDPOINTS.MINIATURAS}/search?search=${encodeURIComponent(searchValue)}&field=${encodeURIComponent(apiSearchField)}`,
          {
            headers: {
              ...getAuthHeaders()
            }
          });
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []); // garantir que seja um array, mesmo que o backend retorne algo inesperado
      } catch (err) {
        console.error('Erro na busca:', err);
        setSearchResults([]);
      }
    };
    // Debounce para evitar muitas requisições ao backend enquanto o usuário digita, só busca após 300ms
    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchValue, searchField]);

  // Limpar busca
  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
  };

  // Lista a renderizar: resultados de busca ou itens da página atual
  // const listToRender = searchValue.trim() ? searchResults : currentItems;

  return (
    <div className={`${styles.container} miniatura-list`}>
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

      {/* Notificação de erro de edição */}
      <Notification
        open={!!mensagemErro}
        message={mensagemErro}
        severity="error"
        onClose={() => setMensagemErro('')}
        duration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      {/* Título da página */}
      <h2 className={styles.title}>{pageTitle}</h2>

      {/* Busca autocomplete  por outros campos */}
      <div className={styles.searchSection}>
        <div className={styles.inputGroup}>
          <label className={styles.searchLabel}>Buscar Miniaturas</label>
          <div className={styles.searchRow}>

            {/* Campo de seleção para o campo de busca */}
            <FormControl
              size="small"
              className={styles.searchFieldControl}
            >
              <InputLabel id="search-field-label" sx={{
                color: 'var(--color-primary-button, #00ffcc)',
                '&.Mui-focused': {
                  color: 'var(--color-primary-button, #00ffcc)'
                }
              }}>Campo</InputLabel>
              <Select
                labelId="search-field-label"
                id="search-field-select"

                value={searchField}
                label="Campo"
                onChange={(e) => setSearchField(e.target.value)}
                MenuProps={{
                  disableScrollLock: true, // evita problemas de scroll em alguns navegadores

                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(26, 26, 46, 0.98)',
                      color: 'var(--color-text-light, #ffffff)',
                      border: '1px solid var(--color-primary-button, #00ffcc)'
                    }
                  }
                }}
                sx={{
                  color: 'var(--color-text-light, #ffffff)',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary-button, #00ffcc)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary-button, #00ffcc)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary-button, #00ffcc)'
                  },
                  '.MuiSvgIcon-root': {
                    color: 'var(--color-primary-button, #00ffcc)'
                  }
                }}
              >
                {SEARCH_FIELD_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
              placeholder={`Pesquisar por ${SEARCH_FIELD_OPTIONS.find((option) =>
                option.value === searchField)?.label?.toLowerCase() || 'nome'}`}
            />
            <button
              onClick={clearSearch}
              className={styles.clearButton}
            >
              X
            </button>
          </div>

          {/* Lista de sugestões autocomplete */}
          {searchResults.length > 0 && (
            <div className={styles.searchSuggestions}>
              {searchResults.map((res) => (
                <div key={res.id} className={styles.suggestionItem}>
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
      </div>

      {/* Lista de miniaturas */}
      <ul className={styles.list}>
        {listToRender.map(m => (
          <li key={m.id} className="item-wrapper">
            <div className="item-meta">
              <strong className={styles.metaLabel}>Nome do personagem</strong>:
              <span className={searchField === 'nome' ? styles.highlightRow : ''}>
                {highlightText(m.nome, searchValue, 'nome')}
              </span>
              <br />

              <strong className={styles.metaLabel}>Universo</strong>:
              <span className={searchField === 'universo' ? styles.highlightRow : ''}>
                {highlightText(m.universo, searchValue, 'universo')}
              </span>
              <br />

              <strong className={styles.metaLabel}>Escala</strong>:
              <span className={searchField === 'escala' ? styles.highlightRow : ''}>
                {highlightText(m.escala, searchValue, 'escala')}
              </span>
              <br />

              <strong className={styles.metaLabel}>Material</strong>:
              <span className={searchField === 'material' ? styles.highlightRow : ''}>
                {highlightText(m.material, searchValue, 'material')}
              </span>
              <br />

              <strong className={styles.metaLabel}>Marca da Resina/Filamento</strong>:
              <span className={searchField === 'marcaResina' ? styles.highlightRow : ''}>
                {highlightText(m.marca, searchValue, 'marcaResina')}
              </span>
              <br />

              <strong className={styles.metaLabel}>Altura</strong>:
              <span className={searchField === 'altura' ? styles.highlightRow : ''}>
                {highlightText(m.altura, searchValue, 'altura')}
              </span> cm
              <br />

              <strong className={styles.metaLabel}>Data de Cadastro</strong>: {new Date(m.data_criacao).toLocaleString('pt-BR')}
              {m.data_modificacao && (
                <>
                  <br />
                  <strong className={styles.metaLabel}>Data de Modificação</strong>: {new Date(m.data_modificacao).toLocaleString('pt-BR')}
                </>
              )}
            </div>

            {/* BOTÕES EDITAR E DELETAR */}
            <div className="item-actions">
              <Button label='Editar no Dashboard' onClick={() => handleEditClick(m)} variant='secondary' />
              <Button label='Deletar' onClick={() => handleDelete(m.id)} variant='danger' />
            </div>
          </li>
        ))}
      </ul>

      {/* Paginação */}
      <Stack
        ref={paginationRef}
        spacing={2}
        alignItems="center"
        className={styles.pagination}
      >
        <Pagination
          count={Math.ceil(miniaturas.length / itemsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Stack>

      {/* modal de edição simples */}
      <MiniatureModal
        open={open}
        // fechar modal ao clicar no botão ou apertar ESC
        onClose={(event, reason) => {
          if (!reason || reason === 'escapeKeyDown') {
            setOpen(false);
          }
        }}
        onSave={handleSave}
        selectedMiniatura={selectedMiniatura}
        activeTab={activeTab}
        onTabChange={(event, newValue) => setActiveTab(newValue)}
        editFormData={editFormData}
        onInputChange={handleChange}
        universoOptions={universoOptions}
        escalasOptions={escalasOptions}
        materiaisOptions={materiaisOptions}
        marcasOptions={marcasOptions}
        styles={styles}
      />
    </div>
  );
}


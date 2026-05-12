import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './MiniatureList.module.css';
import Notification from './Notification';
import MiniatureModal from './MiniatureModal';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { handleDeleteMiniatura, handleSaveMiniatura, handleInputChange } from '../actions/miniaturesActions';
// import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import useMiniatureSearch from '../features/miniatures/hooks/useMiniatureSearch';
import MiniatureSearchSection from './miniatures/MiniatureSearchSection';
import MiniatureItemsList from './miniatures/MiniatureItemsList';
import useMiniaturePagination from '../features/miniatures/hooks/useMiniaturePagination';

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

// Função para construir os dados do formulário de edição a partir da miniatura selecionada,
// garantindo que o formato seja consistente com o esperado pelo formulário, e evitando repetição 
// de código tanto no clique de edição quanto na abertura via URL.
const buildEditFormData = (miniatura) => ({
  nomeDoPersonagem: miniatura.nome,
  universo: miniatura.universo,
  escala: miniatura.escala,
  material: miniatura.material,
  marca: miniatura.marca,
  altura: miniatura.altura != null ? String(miniatura.altura) : ''
});

export default function MiniaturaList({ miniaturas, onDelete, onUpdate, modo = 'home' }) {
  // Estados para modal de edição da miniatura
  const [open, setOpen] = useState(false);
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openedFromParam, setOpenedFromParam] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Estado para a aba ativa no modal
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Estados e lógica para paginação, utilizando o hook personalizado useMiniaturePagination para calcular os 
  // índices dos itens a serem exibidos e controlar a página atual, total de páginas, e referência para o 
  // componente de paginação.
  const itemsPerPage = 10;
  const { page, setPage, paginationRef, markDeleted, totalPages } = useMiniaturePagination(miniaturas.length, itemsPerPage);

  // Estados de busca e resultados da busca para filtrar a lista de miniaturas exibida conforme o 
  // usuário digita.
  const [searchValue, setSearchValue] = useState('');
  const [searchField, setSearchField] = useState('nome');
  const { searchResults, clearSearchResults } = useMiniatureSearch(searchValue, searchField);

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
    markDeleted(); // marca que houve um delete
  };

  // clicar em editar abre modal
  const handleEditClick = (mini) => {
    const newEditData = buildEditFormData(mini);

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

  // Abrir modal de edição se editId estiver presente na URL e 
  // modo for dashboard, para permitir edição
  useEffect(() => {
    if (modo !== 'dashboard' || !editIdFromUrl || openedFromParam) return;

    const mini = miniaturas.find((m) => String(m.id) === String(editIdFromUrl));
    if (!mini) return;

    setSelectedMiniatura(mini);
    setEditFormData(buildEditFormData(mini));
    setActiveTab(0); // Define a aba como "Dados Básicos" ao abrir via URL
    setOpen(true);
    setOpenedFromParam(true);
    // Remove o parâmetro assim que o modal abre para evitar reabertura em refresh
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('editId');
    setSearchParams(nextParams, { replace: true });
  }, [modo, editIdFromUrl, miniaturas, openedFromParam, searchParams, setSearchParams]);

  // salvar edição
  const clearEditIdParam = () => {
    if (!editIdFromUrl) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('editId');
    setSearchParams(nextParams, { replace: true });
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedMiniatura(null);
    setActiveTab(0);
    setOpenedFromParam(false);
    clearEditIdParam();
  };

  // Handle para salvar as alterações da miniatura editada, passando os dados do formulário, o ID da 
  // miniatura selecionada, e as funções de callback para atualizar a lista, mostrar mensagens de 
  // sucesso/erro, fechar o modal e ajustar a severidade da notificação conforme o resultado da operação.
  const handleSave = (e) =>
    handleSaveMiniatura(e, editFormData, selectedMiniatura.id, onUpdate, setMensagemSucesso,
      setMensagemErro, closeModal, setSeveridade);
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

  // useMemo para evitar reordenar a lista toda vez que o componente renderizar, só reordena quando a 
  // lista de miniaturas mudar.
  const miniaturasOrdenadas = useMemo(() => [...miniaturas].sort((a, b) => {
    const diff = getActivityTimestamp(b) - getActivityTimestamp(a);
    if (diff !== 0) return diff;
    return Number(b.id || 0) - Number(a.id || 0);
  }), [miniaturas]);
  // const miniaturasOrdenadas = [...miniaturas].sort(
  //   (a, b) => new Date(b.data_criacao) - new Date(a.data_criacao)
  // );
  // Cálculo dos índices para a paginação
  const indexOfLastItem = page * itemsPerPage;
  // O índice do primeiro item é calculado subtraindo o número de itens por página do índice do último item
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // O array de miniaturas é fatiado para obter apenas os itens que devem ser exibidos na página atual
  const currentItems = miniaturasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

  // Ordenação dos resultados de busca utilizando a mesma lógica de atividade recente, para manter 
  // consistência na exibição tanto da lista completa quanto dos resultados filtrados. Isso garante que, 
  // mesmo ao buscar, os itens mais recentemente criados ou editados apareçam primeiro, proporcionando 
  // uma experiência mais intuitiva para o usuário.
  const sortedSearchResults = useMemo(() => [...searchResults].sort((a, b) => {
    const diff = getActivityTimestamp(b) - getActivityTimestamp(a);
    if (diff !== 0) return diff;
    return Number(b.id || 0) - Number(a.id || 0);
  }), [searchResults]);

  const listToRender = searchValue.trim().length > 0 ? sortedSearchResults : currentItems;

  // Título da página que muda dinamicamente conforme o valor do input de busca e os resultados 
  // encontrados, para dar um feedback visual ao usuário sobre o que está sendo exibido
  const pageTitle = searchValue.trim().length > 0
    ? (searchResults.length > 0 ? 'Miniaturas encontradas' : 'Nenhuma miniatura encontrada')
    : 'Miniaturas Cadastradas';

  // Limpar busca
  const clearSearch = () => {
    setSearchValue('');
    clearSearchResults();
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

      {/* Busca autocomplete por outros campos */}
      <MiniatureSearchSection
        styles={styles}
        searchField={searchField}
        setSearchField={setSearchField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        clearSearch={clearSearch}
        searchResults={searchResults}
        searchFieldOptions={SEARCH_FIELD_OPTIONS}
      />

      {/* Lista de miniaturas */}
      <MiniatureItemsList
        styles={styles}
        listToRender={listToRender}
        searchField={searchField}
        searchValue={searchValue}
        highlightText={highlightText}
        modo={modo}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      <Stack
        ref={paginationRef}
        spacing={2}
        alignItems="center"
        className={styles.pagination}
      >
        <Pagination
          count={totalPages}
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


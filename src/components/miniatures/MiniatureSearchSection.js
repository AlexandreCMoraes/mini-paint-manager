import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Componente para a seção de busca de miniaturas com campo de seleção e sugestões 
// baseadas nos resultados da busca em tempo real
export default function MiniatureSearchSection({
    styles,
    searchField,
    setSearchField,
    searchValue,
    setSearchValue,
    clearSearch,
    searchResults,
    searchFieldOptions,
}) {
    return (
        <div className={styles.searchSection}>
            <div className={styles.inputGroup}>
                <label className={styles.searchLabel}>Buscar Miniaturas</label>
                <div className={styles.searchRow}>
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
                                disableScrollLock: true,
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
                            {searchFieldOptions.map((option) => (
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
                        placeholder={`Pesquisar por ${searchFieldOptions.find((option) =>
                            option.value === searchField)?.label?.toLowerCase() || 'nome'}`}
                    />
                    <button
                        onClick={clearSearch}
                        className={styles.clearButton}
                    >
                        X
                    </button>
                </div>

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
    );
}

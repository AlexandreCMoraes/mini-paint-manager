import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { searchMiniatures } from '../features/miniatures/service';

// Componente de busca com autocomplete
export default function MiniaturaSearch({ onResults }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const delay = setTimeout(async () => {

      if (!inputValue.trim()) {
        setOptions([]);
        setIsLoading('');
        onResults([]);
        return;
      }
      // Busca no backend usando o endpoint de busca simples, que retorna miniaturas 
      // cujo nome começa com o input (case-insensitive).
      // fetch(`/miniatures/search?search=${encodeURIComponent(inputValue)}`)
      // .then(res => res.json())
      // .then(data => {
      // console.log("Resultado do backend:", data);

      // transforma para autocomplete (MUI espera label e value, mas tem que passar a 
      // miniatura inteira no value para usar depois)
      // const opts = data.map(m => ({
      //   label: m.nome,
      //   miniatura: m
      // }));

      try {
        setIsLoading(true);
        setSearchError('');
        const data = await searchMiniatures(inputValue);
        const resultList = Array.isArray(data) ? data : [];

        // transforma para autocomplete (MUI espera label)
        const opts = resultList.map((m) => ({
          label: m.nomeDoPersonagem || m.nome || 'Miniatura sem nome',
          miniatura: m,
        }));

        setOptions(opts);
        onResults(resultList); // manda para o MiniaturaList
      } catch (err) {
        setSearchError('Nao foi possivel buscar miniaturas no momento.');
        setOptions([]);
        onResults([]);
      } finally {
        setIsLoading(false);
      }

    }, 300);

    return () => clearTimeout(delay);
  }, [inputValue, onResults]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label || ''}
      inputValue={inputValue}
      onInputChange={(e, value) => setInputValue(value)}

      // Quando o usuário seleciona uma opção, passa a miniatura completa para o 
      // onResults.
      onChange={(e, value) => {
        if (value?.miniatura) {
          onResults([value.miniatura]);
        }
      }}

      loading={isLoading}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pesquisar miniaturas"
          error={Boolean(searchError)}
          helperText={searchError} />
      )}
    />
  );
}

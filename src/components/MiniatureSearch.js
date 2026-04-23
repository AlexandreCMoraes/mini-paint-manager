import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

// Componente de busca com autocomplete
export default function MiniaturaSearch({ onResults }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const delay = setTimeout(async () => {

      console.log("Digitando:", inputValue);

      if (!inputValue.trim()) {
        setOptions([]);
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
        const response = await fetch(
          `${API_ENDPOINTS.MINIATURAS}/search?search=${encodeURIComponent(inputValue)}`,
          {
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Falha na busca de miniaturas (status: ${response.status})`);
        }

        const data = await response.json();
        const resultList = Array.isArray(data) ? data : [];

        // transforma para autocomplete (MUI espera label)
        const opts = resultList.map((m) => ({
          label: m.nome,
          miniatura: m,
        }));

        setOptions(opts);
        onResults(resultList); // manda para o MiniaturaList
      } catch (err) {
        console.error('Erro na busca:', err);
        setOptions([]);
        onResults([]);
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

      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Pesquisar miniaturas" />
      )}
    />
  );
}

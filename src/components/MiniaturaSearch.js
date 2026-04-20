import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Componente de busca com autocomplete
export default function MiniaturaSearch({ onResults }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const delay = setTimeout(() => {

      console.log("Digitando:", inputValue);

      if (!inputValue.trim()) {
        setOptions([]);
        onResults([]);
        return;
      }
      // Busca no backend usando o endpoint de busca simples, que retorna miniaturas 
      // cujo nome começa com o input (case-insensitive).
      fetch(`/miniaturas/search?search=${encodeURIComponent(inputValue)}`)
        .then(res => res.json())
        .then(data => {
          console.log("Resultado do backend:", data);

          // transforma para autocomplete (MUI espera label e value, mas tem que passar a 
          // miniatura inteira no value para usar depois)
          const opts = data.map(m => ({
            label: m.nome,
            miniatura: m
          }));

          setOptions(opts);
          onResults(data); // manda pro MiniaturaList
        })
        .catch(err => {
          console.error("Erro na busca:", err);
          setOptions([]);
          onResults([]);
        });

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

      // Quando seleciona um item, manda a miniatura inteira pro onResults, que atualiza a 
      // lista para mostrar só ela
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
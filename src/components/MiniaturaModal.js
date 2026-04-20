import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from './Buttons/Button';

export default function MiniaturaModal({
  open,
  onClose,
  onSave,
  selectedMiniatura,
  activeTab,
  onTabChange,
  editFormData,
  onInputChange,
  universoOptions,
  escalasOptions,
  materiaisOptions,
  marcasOptions,
  styles
}) {
  return (
    <Modal
      open={open}
      // fechar modal ao clicar no botão ou apertar ESC
      onClose={onClose}
      disableEscapeKeyDown={false}
      aria-labelledby="edit-miniatura-modal"
      aria-describedby="basic-edit-modal"
    >
      <Box className={styles.modalContent}>
        <h2 id="edit-miniatura-modal" className={styles.modalTitle}>Edição de Miniatura</h2>
        {selectedMiniatura ? (
          <>
            {/* Tabs para diferentes seções de edição */}
            <Tabs
              value={activeTab}
              onChange={onTabChange}
              aria-label="abas de edição da miniatura"
              className={styles.modalTabs}
            >
              <Tab label="Dados Básicos" />
              <Tab label="Imagem" />
              <Tab label="Extras" />
            </Tabs>

            <Box className={styles.tabPanel}>
              {activeTab === 0 && (
                // Conteúdo da aba de dados básicos, que inclui o formulário de edição dos
                // campos principais da miniatura.
                <form onSubmit={onSave}>
                  <input
                    type="text"
                    name="nomeDoPersonagem"
                    placeholder="Nome do Personagem"
                    value={editFormData.nomeDoPersonagem || ''}
                    onChange={onInputChange}
                    className={styles.modalInput}
                  />
                  <input
                    type="text"
                    name="universo"
                    placeholder="Universo"
                    value={editFormData.universo || ''}
                    onChange={onInputChange}
                    list="universos"
                    className={styles.modalInput}
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
                    onChange={onInputChange}
                    list="escalas"
                    pattern="^(\d+:\d+|N/A)$"
                    className={styles.modalInput}
                    title="A escala deve ser no formato 1:12, 1:24, etc, ou N/A."
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
                    onChange={onInputChange}
                    list="materiais"
                    className={styles.modalInput}
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
                    onChange={onInputChange}
                    list="marcas"
                    className={styles.modalInput}
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
                    onChange={onInputChange}
                    min="0.01"
                    step="0.01"
                    required
                    title="A altura deve ser um número maior que zero."
                    className={styles.modalInput}
                  />
                  {/* Botões das miniaturas cadastradas */}
                  <div className={styles.modalActions}>
                    <Button label="Cancelar" onClick={() => onClose()} variant="neutral" />
                    <Button type="submit" label="Salvar Alterações" variant="primary" />
                  </div>
                </form>
              )}
              {activeTab === 1 && (
                // Conteúdo da aba de imagem, que pode incluir upload de imagem, visualização
                // da imagem atual, etc.
                <Box className={styles.secondaryTabContent}>
                  <p>Conteúdo da aba Imagem - Em desenvolvimento</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button label="Cancelar" onClick={() => onClose()} variant="neutral" />
                    <Button type="submit" label="Salvar Alterações" variant="primary" />
                  </div>
                </Box>
              )}
              {activeTab === 2 && (
                // Conteúdo da aba de extras, que pode incluir campos adicionais que não se
                // encaixam em dados básicos ou imagem, como descrição, tags, etc.
                <Box className={styles.secondaryTabContent}>
                  <p>Conteúdo da aba Extras - Em desenvolvimento</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button label="Cancelar" onClick={() => onClose()} variant="neutral" />
                    <Button type="submit" label="Salvar Alterações" variant="primary" />
                  </div>
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </Box>
    </Modal>
  );
}

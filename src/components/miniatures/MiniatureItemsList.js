import Button from '../Buttons/Button';

// Componente para renderizar a lista de miniaturas, destacando os campos de acordo com o campo de
//  busca selecionado e chamando as funções de edição e exclusão passadas como props do componente pai.
export default function MiniatureItemsList({
    styles,
    listToRender,
    searchField,
    searchValue,
    highlightText,
    modo,
    onEdit,
    onDelete,
}) {
    return (
        <ul className={styles.list}>
            {listToRender.map((m) => (
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

                    <div className="item-actions">
                        <Button label={modo === 'dashboard' ? 'Editar' : 'Editar no Dashboard'} onClick={() => onEdit(m)} variant="secondary" />
                        <Button label="Deletar" onClick={() => onDelete(m.id)} variant="danger" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

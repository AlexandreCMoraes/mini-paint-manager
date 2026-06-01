# Diagrama de Classes do Sistema de Miniaturas

```mermaid
classDiagram
    class User {
        +int id
        +String username
        +String email
        +String passwordHash
        +DateTime createdAt
        +boolean ativo
        +DateTime deletadoEm
        +String reactivationToken
        +DateTime reactivationTokenExpiresAt
        +cadastrarConta() boolean
        +fazerLogin() boolean
        +reativarConta() boolean
    }

    class Miniatura {
        +int id
        +String nome
        +String universo
        +String escala
        +String material
        +String marca
        +String altura
        +DateTime dataCriacao
        +int userId
        +DateTime dataModificacao
        +salvar() boolean
        +atualizar() boolean
        +excluir() boolean
    }

    User "1" --> "0..*" Miniatura : gerencia
```

# Catalog Cleanup Plugin

<div align="center">

[![npm version](https://badge.fury.io/js/%40ruivalim%2Fcatalog-cleanup.svg)](https://www.npmjs.com/package/@ruivalim/catalog-cleanup)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Um plugin do Backstage para gerenciar e limpar locations do catálogo com uma UI amigável.

</div>

---

## 🎯 O Problema

Sabe quando você tenta criar uma entidade no catálogo do Backstage e recebe um erro dizendo que ela já existe, mas quando você procura na UI... **não encontra nada**?

Isso acontece porque a **location ainda existe na API** do catálogo mesmo que a entidade não esteja mais visível na interface.

### Exemplo Real:

```bash
# Você tenta criar um serviço
❌ Error: Location already exists for "nome-do-servico-teste-2-ms"

# Você busca na UI do Backstage
🔍 "nome-do-servico-teste-2-ms" ... Nenhum resultado encontrado

# WTF? 🤯
```

**Antes deste plugin**, você tinha que fazer isso manualmente:

```bash
# Listar locations
curl -s "https://backstage.yourcompany.com/api/catalog/locations" | jq

# Encontrar o ID da location órfã
# ...muito JSON pra ler...

# Deletar manualmente
curl -X DELETE "https://backstage.yourcompany.com/api/catalog/locations/507d46dd-ac5e-4152-8a4c-37eb8dfe3fcf"
```

**Com este plugin**, você faz isso em 3 cliques na UI! 🎉

---

## ✨ Funcionalidades

- 📋 **Listagem completa** de todas as catalog locations
- 🔍 **Busca e filtração** rápida de locations
- 🗑️ **Delete com confirmação** para evitar acidentes
- 🔄 **Auto-refresh** após deletar uma location
- 📄 **Paginação** para lidar com muitas locations
- 🎨 **UI consistente** com o design do Backstage

---

## 📦 Instalação

### 1. Instalar o pacote

```bash
# No diretório raiz do seu Backstage
yarn add --cwd packages/app @ruivalim/catalog-cleanup
```

### 2. Adicionar o plugin ao app

Edite `packages/app/src/App.tsx`:

```tsx
import { CatalogCleanupPage } from '@ruivalim/catalog-cleanup';

// ...

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        {/* ... outras rotas ... */}

        {/* 👇 Adicione esta linha */}
        <Route path="/catalog-cleanup" element={<CatalogCleanupPage />} />

      </Root>
    </AppRouter>
  </>,
);
```

### 3. (Opcional) Adicionar ao menu de navegação

Edite `packages/app/src/components/Root/Root.tsx`:

```tsx
// Adicione o import do ícone
import CleaningServicesIcon from '@material-ui/icons/CleaningServices';

// ...

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* ... outros itens ... */}

        {/* 👇 Adicione este item */}
        <SidebarItem
          icon={CleaningServicesIcon}
          to="catalog-cleanup"
          text="Catalog Cleanup"
        />

      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
```

---

## 🚀 Como Usar

### 1. Acesse o plugin

Navegue para `/catalog-cleanup` no seu Backstage ou clique no menu lateral.

### 2. Encontre a location órfã

Use a busca para encontrar a location problemática:

![Search for location](https://via.placeholder.com/800x200.png?text=Busque+pela+location)

### 3. Delete a location

Clique no ícone de lixeira e confirme:

![Delete confirmation](https://via.placeholder.com/600x300.png?text=Confirmação+de+delete)

### 4. Pronto!

A lista será atualizada automaticamente. Agora você pode criar sua entidade sem erros! 🎉

---

## 🔧 Desenvolvimento

Se você quiser contribuir ou rodar localmente:

```bash
# Instalar dependências
yarn install

# Build
yarn build

# Lint
yarn lint

# Testes (quando implementados)
yarn test

# Clean build artifacts
yarn clean
```

### Estrutura do Projeto

```
catalog-cleanup/
├── src/
│   ├── api/
│   │   ├── CatalogClient.ts       # Cliente da API do catálogo
│   │   └── index.ts
│   ├── components/
│   │   ├── CatalogCleanupPage.tsx # Componente principal da UI
│   │   └── index.ts
│   ├── plugin.ts                  # Definição do plugin
│   ├── routes.ts                  # Rotas do plugin
│   └── index.ts                   # Entry point
├── dist/                          # Build output
├── package.json
└── README.md
```

---

## 🔌 API Utilizada

O plugin utiliza os endpoints nativos do Backstage Catalog API:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/catalog/locations` | `GET` | Lista todas as locations |
| `/api/catalog/locations/{id}` | `DELETE` | Deleta uma location específica |

---

## 🔒 Permissões

O plugin requer que o usuário tenha permissões para:
- ✅ Listar locations do catálogo
- ✅ Deletar locations do catálogo

Essas permissões são controladas pelo sistema de permissões do Backstage (RBAC).

---

## 📝 Roadmap

- [ ] Adicionar confirmação dupla para deletar múltiplas locations
- [ ] Exportar lista de locations para CSV
- [ ] Mostrar entidades associadas a cada location
- [ ] Filtros avançados (por tipo, target, etc.)
- [ ] Histórico de locations deletadas
- [ ] Bulk delete de locations

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/Ruivalim/catalog-cleanup/issues) com:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Versão do Backstage e do plugin

---

## 📄 Licença

Este projeto está sob a licença Apache 2.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Rui Valim**

- GitHub: [@Ruivalim](https://github.com/Ruivalim)
- NPM: [@ruivalim](https://www.npmjs.com/~ruivalim)

---

## 🙏 Agradecimentos

- [Backstage](https://backstage.io) - Por criar uma plataforma incrível
- Comunidade Backstage - Por toda a ajuda e inspiração

---

<div align="center">

**Se este plugin te ajudou, deixe uma ⭐ no repositório!**

Made with ❤️ by [Rui Valim](https://github.com/Ruivalim)

</div>

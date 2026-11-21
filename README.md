# Management.Tickets FrontEnd

SPA em Angular 21 para o sistema de gerenciamento de chamados (tickets). Consome a API REST do repositório
**Management.Tickets** (.NET 9): autenticação, usuários, departamentos, categorias, tickets com chat e notificações.

---

## Funcionalidades e telas

| Área | Telas |
|---|---|
| Autenticação | Login, "esqueci minha senha", redefinição de senha (link recebido por e-mail) e troca obrigatória da senha temporária/expirada |
| Dashboard | Cartões com total de usuários, total de tickets, abertos e resolvidos, e lista dos 5 tickets mais recentes |
| Usuários | Listagem com busca, filtro ativo/inativo e paginação; criação (nome, e-mail, perfil e departamento); edição de nome e e-mail; desativar e reativar |
| Tickets | Abertura (título, descrição, prioridade, departamento e categoria); "Todos os tickets"; "Atendimentos" (atribuídos a mim); "Meus tickets"; detalhe com chat, botão "Assumir ticket" e alteração de status |
| Departamentos | Listagem com busca e paginação; criação |
| Categorias | Listagem com busca e paginação; criação |
| Notificações | Sino no layout com as notificações não lidas; clique marca como lida |

O menu lateral é exibido conforme o perfil lido do JWT:

| Menu | Admin | Technician | User |
|---|---|---|---|
| Dashboard, abrir ticket, "Meus tickets" | ✔ | ✔ | ✔ |
| "Atendimentos", "Todos os tickets" | ✔ | ✔ | — |
| Usuários | ✔ | ✔ (a API responde 403) | — |
| Setores (departamentos) e Categorias | ✔ | — | — |

O controle é apenas visual: as rotas não têm guard por perfil, e quem decide a permissão é a API.

Não há tela para a troca voluntária de senha (`PUT /api/Users/{id}/update-password` existe na API, mas não é
consumido).

---

## Tecnologias

| Item | Versão (`package.json`) |
|---|---|
| Angular (core, common, router, forms, platform-browser, compiler) | ^21.2.0 |
| Angular CLI / `@angular/build` | ^21.2.23 |
| TypeScript | ~5.9.2 |
| RxJS | ~7.8.0 |
| Tailwind CSS (via `@tailwindcss/postcss`) | ^4.1.12 |
| Vitest + jsdom (testes) | ^4.0.8 / ^28.0.0 |
| Prettier | ^3.8.1 |

Não há bibliotecas de componentes de UI, gerenciamento de estado ou i18n.

---

## Arquitetura

- Componentes **standalone**, bootstrap com `bootstrapApplication` (`main.ts` + `app.config.ts` com
  `provideRouter` e `provideHttpClient`).
- Organização por feature: cada área tem suas páginas, services e models.
- Estado de tela com `signal`/`computed` por componente (carregando, erro, mensagens, paginação). Não há store
  global; o estado compartilhado é o token e o usuário no `localStorage`.
- Formulários reativos (`FormBuilder`) e, em alguns pontos, template-driven.
- Estilo com classes Tailwind diretamente nos templates.

### Estrutura de diretórios

```
src/app/
├── app.ts / app.html / app.config.ts / app.routes.ts
├── core/
│   ├── constants/api.constants.ts      API_BASE_URL e API_ENDPOINTS
│   └── guards/auth-guard.ts            authGuard
├── layout/main-layout/                 shell autenticado (menu lateral, notificações, logout)
├── models/api-error-response.ts        { success, errors[] }
└── features/
    ├── auth/          login/, forgot-password/, reset-password/, change-password/, services/, models/
    ├── dashboard/     pages/dashboard/
    ├── users/         pages/{user-list, user-create, user-edit}/, services/, models/
    ├── tickets/       pages/{ticket-list, ticket-create, ticket-details, ticket-assignedto, tickets-by-userid}/, services/, models/
    ├── departments/   pages/{department-list, department-create}/, services/, models/
    ├── categories/    pages/{category-list, category-create}/, services/, models/
    └── notifications/ services/, models/
```

Cada página tem `<nome>.ts`, `.html`, `.css` e `.spec.ts`. Os services são `providedIn: 'root'`.

---

## Rotas

Definidas em `src/app/app.routes.ts`, sem lazy loading.

| Rota | Tela | Proteção |
|---|---|---|
| `/` | redireciona para `/login` | — |
| `/login` | Login | — |
| `/forgot-password` | Esqueci minha senha | — |
| `/reset-password?token=...` | Redefinir senha | — |
| `/change-password` | Troca de senha temporária | — |
| `/dashboard` | Dashboard | `authGuard` |
| `/users`, `/users/create`, `/users/:id/edit` | Usuários | `authGuard` |
| `/tickets`, `/tickets/create`, `/tickets/get-by-userid`, `/tickets/assigned`, `/tickets/:id` | Tickets | `authGuard` |
| `/departments`, `/departments/create` | Departamentos | `authGuard` |
| `/categories`, `/categories/create` | Categorias | `authGuard` |

As rotas protegidas ficam sob o `MainLayoutComponent`. O `authGuard` verifica apenas se existe token no
`localStorage` (não verifica expiração nem perfil). Não há rota curinga (`**`).

---

## Comunicação com a API

- O endereço da API fica em `src/app/core/constants/api.constants.ts`:

  ```ts
  export const API_BASE_URL = 'https://management-tickets-api.onrender.com';
  //export const API_BASE_URL = 'https://localhost:7253';
  ```

  Por padrão o front aponta para a API em produção (Render). Não há arquivos `environments`.
- `API_ENDPOINTS` monta as bases `api/Users`, `api/Auth`, `api/Tickets`, `api/Departments`, `api/Categories` e
  `api/Notifications`.
- Os services (`AuthService`, `UserService`, `TicketService`, `DepartmentService`, `CategoryService`,
  `NotificationService`) usam `HttpClient` diretamente.
- Os models em `features/*/models` são escritos à mão e espelham os modelos da API; não há cliente gerado.
- Tickets: `priority` e `status` são enviados como número e recebidos como string (`'Open'`, `'High'`...).
- A API devolve erros no formato `{ success: false, errors: [...] }`. O tratamento de erro é feito em cada componente.

---

## Autenticação

1. O login (`POST api/Auth/login`) grava `accessToken` e `currentUser` no `localStorage`.
2. Se a resposta trouxer `mustChangePassword = true`, o usuário é levado para `/change-password`; caso contrário,
   para `/dashboard`.
3. Cada método de service monta o header `Authorization: Bearer <token>` manualmente; **não existe
   `HttpInterceptor`**.
4. Perfil e id do usuário são lidos do payload do JWT (`AuthService.getUserRole()` e `getUserId()`).
5. O logout remove o `accessToken` e volta para o login.

Não há tratamento central de `401` (token expirado) nem renovação de token.

---

## Testes

```bash
npm test
```

Executa `ng test` (builder `@angular/build:unit-test`, Vitest + jsdom). Existem 26 arquivos `*.spec.ts` gerados pelo
Angular CLI, todos com o teste mínimo "should create"/"should be created".

**Estado verificado em 2026-11-20: a suíte não compila** (24 erros `TS2305`). Os specs importam os nomes antigos das
classes (`Login`, `TicketList`...), mas os componentes e services foram renomeados com sufixo (`LoginComponent`,
`TicketListComponent`, `AuthService`...). Nenhum teste é executado e não há testes de comportamento.

---

## Como executar localmente

### Pré-requisitos

- Node.js compatível com o Angular 21 e npm (o `package.json` declara `packageManager: npm@11.8.0`)
- Para usar a API local: o backend `Management.Tickets` rodando em `https://localhost:7253`

### Instalação e execução

```bash
npm install
npm start          # ng serve em http://localhost:4200
```

### Usando a API local

Em `src/app/core/constants/api.constants.ts`, comente a linha do Render e descomente a de `https://localhost:7253`.
Essa troca é só para desenvolvimento e **não deve ser commitada**. O CORS da API já libera `http://localhost:4200`.

### Outros comandos

```bash
npm run build      # build de produção em dist/
npm run watch      # build contínuo com a configuração de desenvolvimento
```

O build de produção conclui com dois avisos `NG8113` (imports não usados em `TicketDetailsComponent` e
`MainLayoutComponent`).

Formatação: Prettier (`.prettierrc`: `printWidth` 100, aspas simples) e `.editorconfig` (2 espaços, UTF-8).

O deploy do front é feito na Vercel.

---

## Estado atual e limitações

- **Mensagens de erro da API não aparecem em algumas telas**: criação de ticket, criação e edição de usuário leem
  `error.error?.message`, mas a API envia `errors[]`.
- **Ações exibidas sem permissão no backend**: menu Usuários para Technician; "Assumir ticket" visível para User
  (a API responde 403); o dashboard chama `GET api/Users`, que falha para quem não é Admin, e o cartão de usuários
  mostra 0.
- Para Technician e User, os números e os "tickets recentes" do dashboard são globais, porque `GET api/Tickets` não
  filtra por usuário.
- As notificações são carregadas uma vez ao montar o layout (sem polling nem push).
- A rota `/change-password` não tem guard, e o `authGuard` não detecta token expirado.
- A decodificação do JWT usa `atob` (Base64, não Base64URL).
- Há `console.log` com dados de resposta em vários componentes.
- Testes quebrados e sem CI (ver [Testes](#testes)).

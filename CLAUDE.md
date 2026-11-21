# Management.Tickets-FrontEnd

SPA em Angular 21 (componentes standalone) com Tailwind CSS 4. Consome a API do repositório `Management.Tickets`.

## Comandos
```bash
npm install
npm start          # ng serve em http://localhost:4200
npm run build      # ng build
npm test           # ng test (Vitest + jsdom)
```
Formatação: Prettier (`printWidth` 100, aspas simples; HTML com parser `angular`) e `.editorconfig`
(2 espaços, UTF-8). Mantenha o estilo do arquivo que estiver editando.

## Estrutura (`src/app/`)
- `app.routes.ts`: todas as rotas (imports diretos, sem lazy loading). Rotas autenticadas ficam sob
  `MainLayoutComponent` com `authGuard`.
- `core/`: constantes (`api.constants.ts`) e guards.
- `layout/main-layout/`: shell autenticado (menu, navegação).
- `models/`: modelos compartilhados (ex.: `api-error-response.ts`).
- `features/<area>/`: `auth`, `users`, `tickets`, `departments`, `categories`, `notifications`, `dashboard`.
  Dentro de cada feature:
  ```
  pages/<nome>/<nome>.ts|html|css|spec.ts   # um componente por página
  services/<nome>.ts                        # chamadas HTTP (HttpClient)
  models/*.ts                               # interfaces TypeScript do contrato da API
  ```

## Convenções do código existente
- Arquivos sem sufixo (`ticket-list.ts`, `ticket.ts`); classes com sufixo (`TicketListComponent`, `TicketService`,
  `AuthService`). Seletores `app-...`.
- Estado de tela com `signal` (`isLoading`, `isError`, `message`...), formulários reativos (`FormBuilder`),
  `templateUrl`/`styleUrl` separados. Estilo visual via classes Tailwind no HTML.
- Services `providedIn: 'root'`; endpoints vêm de `API_ENDPOINTS` (`core/constants/api.constants.ts`).
- Mensagens de UI em português. Erros do backend chegam em `error.error?.message`.

## API e autenticação
- `API_BASE_URL` está fixo em produção (Render); a linha local (`https://localhost:7253`) fica comentada.
  Para desenvolvimento local, alterne a linha e **não commite a troca**. Melhor refatorar para
  `environments` (candidato a tarefa).
- Token JWT em `localStorage` (`accessToken`), lido por `AuthService.getToken()`. **Não há interceptor HTTP**:
  cada método de service monta o header `Authorization: Bearer ...` manualmente. Em service novo, siga o padrão
  até existir o interceptor (ver "Melhorias").
- Role e id do usuário vêm do payload do JWT (`AuthService.getUserRole()`, `getUserId()`).
- Ao mudar um modelo em `features/*/models`, confirme o contrato no backend (`WebAPI/Models/...`).
  Ticket: `priority`/`status` são enviados como número e recebidos como string.

## Cuidados
- Os `*.spec.ts` gerados importam classes sem o sufixo (`TicketList`), enquanto o componente se chama
  `TicketListComponent`: provavelmente estão quebrados. Rode `npm test` antes de assumir que passam.
- Há bastante código repetido nos services (montagem de `HttpParams` e headers) e `console.log`/`console.error`
  espalhados. Não "limpar" isso como efeito colateral de outra tarefa.
- Existe `.vscode/mcp.json` com o MCP do Angular CLI (`npx -y @angular/cli mcp`).

## Melhorias candidatas
- `HttpInterceptor` para o token + tratamento central de 401.
- `environments` em vez de alternar `API_BASE_URL` à mão.
- Guards por role (hoje só existe `authGuard`).
- Lazy loading das rotas por feature.
- Testes reais para services e páginas (hoje só há specs gerados).

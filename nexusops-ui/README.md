# NexusOps UI

React + TypeScript + Vite frontend with a public landing page and authentication UI.

- `/#login`: email/password login, password visibility, field validation and access help.
- `/#signup`: invitation-based registration with name, invited email, invitation code and password confirmation.
- Landing page navigation opens these screens; the hero email form carries the email into registration.

Run `npm install` then `npm run dev`. Use `npm run build` for a production build and `npm run lint` for lint checks.

Login accepts the public demo account `responder@nexusops.demo` / `NexusOps@2026` and opens `/#workspace`. The “Use demo account” button fills these fields. Only a demo marker is stored in sessionStorage; entered passwords are not persisted. Logout clears the marker. This frontend guard is not production authentication or authorization.

The Responder workspace includes assigned incident filters, bulk/single ACK, incident details, required-reason resolution after ACK, linked alert closure, timeline notes and a notification inbox. Reading a notification does not acknowledge its incident. Static on-call and escalation information is illustrative; no live timers or paging run. Incident and inbox changes reset on unmount/reload; “Reset sample data” also restores fixtures. Implementation lives in `src/features/responder/`, with demo login in `src/demo/auth.ts`.

Signup remains a UI preview: it does not validate invitations or create users. Backend integration must enforce invitation validity, password policy, assigned permissions and authentication. The eight-character signup check is a provisional UI rule to align with the eventual backend policy.

Workspace navigation also includes Services (read-only catalog and incident drilldown), Team (sample directory and static assignments), AI Investigation (sample evidence reports), Automation (request, approve/reject and simulated execution), and Profile (click the account avatar). These views live in `WorkspacePages.tsx`. Profile edits include avatar upload (PNG/JPG/WebP, up to 2 MB), display name, title, department, phone, location and timezone. The profile shows team, escalation assignment and MVP permissions; email, role and password remain admin-managed. Changes survive tab switches but reset when leaving/reloading the workspace. Investigation snapshots and action histories have the same lifecycle; incident/inbox reset does not clear those histories. All actions require approval in the demo; resolved incidents block further decisions/execution. AI model calls, execution adapters, server authorization, quota/breaker enforcement, PIR, backend APIs and database integration remain unimplemented. The preferred timezone is stored only as a local preference; incident timestamps use browser time.

Authentication components and styles live in `src/pages/AuthPage.tsx` and `src/pages/auth.css`. Hash navigation is managed in `src/App.tsx` and supports direct links and browser history without server rewrite configuration.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

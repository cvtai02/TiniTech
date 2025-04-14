# TypeScript and Vite.js Coding Conventions

- **File Naming**: PascalCase for type/interface files (e.g., `UserProfile.ts`), camelCase for others (e.g., `userUtils.ts`).
- **Types/Interfaces**: PascalCase (e.g., `interface UserProfile`). Avoid `I` prefix for interfaces.
- **Variables/Functions**: camelCase (e.g., `getUserData`, `userName`).
- **Components**: PascalCase for React components (e.g., `UserCard.tsx`).
- **Type Annotations**: Specify types explicitly (e.g., `const count: number = 0`).
- **Vite Config**: Use `vite.config.ts` with `defineConfig`.
- **ESLint/Prettier**: Use `@typescript-eslint` and Prettier for consistency.
- **Imports**: Absolute paths via `tsconfig.json` (e.g., `import { User } from '@/types'`).
- **Avoid Any**: Minimize `any`; use specific types or generics.
- **Modules**: Use ES modules (`import/export`) for Vite.
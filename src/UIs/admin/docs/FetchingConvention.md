# TypeScript and Vite.js Fetch Data Conventions

- **API Functions**: camelCase, prefixed with `fetch` (e.g., `fetchUserData`).
- **Return Types**: Explicitly type responses (e.g., `Promise<User>`).
- **Error Handling**: Use try-catch, return typed errors (e.g., `ApiError`).
- **Base URL**: Store in `.env` (e.g., `VITE_API_URL`).
- **HTTP Client**: Use `fetch` or `axios` with typed config.
- **Request Methods**: Separate functions per method (e.g., `fetchUserById`, `postUser`).
- **Response Types**: Define interfaces (e.g., `interface UserResponse`).
- **Query Params**: Type as objects (e.g., `{ id: number }`).
- **Async/Await**: Prefer over `.then()` for clarity.
- **Centralized API**: Group in `/api` folder (e.g., `api/users.ts`).

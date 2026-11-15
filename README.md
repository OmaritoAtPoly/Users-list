# User List App

Small React + TypeScript app that consumes the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.

## Features

1. **User list with search** — browse all users and filter by name (case-insensitive).
2. **User posts + create form** — select a user to see their posts. Create a new post with a validated form (title and body are required). The API doesn't persist data, so the new post appears optimistically in the list.
3. **Loading and error states** — visible spinners and error messages with a Retry button for every asynchronous request.
4. **Tests** — 6 Vitest + Testing Library tests covering loading states, search filtering, post loading, form validation, successful creation, and error/retry.
5. **Error boundary** — a `withErrorBoundary` HOC wraps posts and form components to catch render errors gracefully.

## How to run

```bash
# Install dependencies
yarn

# Start dev server (http://localhost:5173)
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Type-check
npx tsc --noEmit

# Lint
yarn lint

# Build for production
yarn build

# Preview production build
yarn preview
```

## Technical decisions

- **Data fetching**: custom `useGet` / `usePost` hooks built on a single Axios instance (`src/hooks/custom.type.ts`), instead of TanStack Query. Keeps the fetching logic visible and dependency-free.
- **State**: status modeled as a discriminated union (`idle | loading | success | error`) inside `RequestState<T>`, making loading/error/success explicit and easy to test.
- **Validation**: manual, field-level validation in `PostForm` (no `react-hook-form` or `zod`) to keep the logic transparent. Errors show only after the user attempts to submit.
- **Error handling**: `ApiError` normalizes network/HTTP/unexpected errors into one type. A `withErrorBoundary` HOC catches render errors in posts/form components. `Status` shows error + Retry for async failures.
- **Optimistic updates**: new posts are prepended to the list immediately on successful creation (`createdPosts` state), since the API doesn't persist data.
- **Styling**: plain CSS with CSS custom properties in `src/index.css`, no Tailwind or CSS Modules.
- **No router**: single-view master-detail layout; `selectedUserId` drives the detail panel.

## What I'd do with more time

- Add `react-query` (TanStack Query) for caching, deduping, and background refetching.
- Add runtime response validation (Zod) at the API boundary instead of trusting the API shape.
- Add pagination for the user list (JSONPlaceholder supports `_page`/`_limit`).
- Add form-level "dirty" tracking and confirmation before navigating away with unsaved changes.
- Add more unit tests for individual components (`PostForm`, `UserList`) in addition to the App integration tests.
- Add E2E tests with Playwright or Cypress.
- Add a "delete post" action and inline edit for existing posts.

## AI usage

AI was used throughout this exercise as a coding assistant. What was asked:

- Suggested project architecture (hooks, components, state shape).
- Wrote the Axios-based hooks (`useGet`, `usePost`) with error normalization.
- Wrote all five UI components (`SearchBar`, `Status`, `UserList`, `PostList`, `PostForm`).
- Wired `App.tsx` with state, search filtering, optimistic post creation, and error boundaries.
- Wrote the Vitest configuration and 6 integration tests.
- Drafted this README.

What was accepted:

- The layered structure (API → hooks → components → App).
- The `RequestState<T>` discriminated union for explicit loading/error/success.
- Using `vi.spyOn(http, ...)` for mocking Axios calls in tests.

What was corrected / changed:

- **Initial `useGet` called `setState` synchronously inside an effect**, triggering the `react-hooks/set-state-in-effect` ESLint rule. Fixed by wrapping the fetch in an inner async function.
- **`Status` label prop** — `label` sets `aria-label` for accessibility, not visible text. Tests were updated to check `aria-label` instead of visible text.
- **Post creation didn't update the list** — `handleCreate` only set `selectedUserId`; added optimistic `createdPosts` state so new posts appear immediately.
- **Test mocking** — removed default mocks from `beforeEach` that interfered with per-test `mockResolvedValueOnce` / `mockRejectedValueOnce`.
- **Inline styles** — removed all inline `style` objects from components and moved them to CSS files with CSS variables.
- **Class component** — replaced the class-based `ErrorBoundary` with a `withErrorBoundary` HOC (function factory) per preference for functional style.
- **Build script** — changed `tsc -b` to `tsc --noEmit` because project-reference build mode didn't pick up jest-dom type augmentations.

## Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start Vite dev server |
| `yarn test` | Run Vitest once |
| `yarn test --watch` | Run Vitest in watch mode |
| `yarn lint` | Run ESLint |
| `yarn build` | Type-check + production build |
| `yarn preview` | Preview production build |

# Web App To-Do List

## 🛠 Backend

- [ ] **Edit Account Endpoint** – Add endpoint for editing `firstname`, `lastname`, `username`, `password`.
- [ ] **Request Validation** – (Optional) Enhance backend request validation.
- [ ] **Post Indexing** – Optimize post queries with database indexing.
- [ ] **Database Encryption** – Encrypt sensitive database fields.
- [ ] **Database TLS** – Enable TLS for secure database connections.
- [ ] **Refresh Tokens** – Implement JWT refresh tokens.
- [ ] **CSRF & CSP** – Add CSRF tokens and Content Security Policy headers.
- [ ] **Database Transactions** – Ensure atomic operations with transactions.
- [ ] **Load Balancing** – Set up via Nginx/Docker Swarm/Kubernetes.
- [ ] **Email Login** – Replace `username` login with `email`.
- [ ] **2FA** – Add two-factor authentication (e.g., TOTP).
- [ ] **Secure Cookies** – Enable `Secure` flag in production.
- [ ] **Contenerize Resource Server** - Add dockerfile for the node/express resource server.

## 🎨 Frontend

- [ ] **Code Cleanup**
  - Consistent casing (e.g., camelCase).
  - Refactor into reusable components.
- [ ] **Cursor Pagination** – For Explore, My Feed, and user posts.
- [ ] **Rich Text Posts**
  - Store/display formatted text (e.g., Markdown).
  - Add editor with formatting tools (e.g., Bold/Italic).
- [ ] **Post Editing** – Allow users to edit their posts.
- [ ] **Admin Panel** – Dashboard for moderators/admins.

## 🐳 Infrastructure

- [ ] **Rootless Containers** – Run Podman/Docker as non-root and add user-add steps + user directives to Dockerfiles.
- [ ] **Move Docker Compose** – Relocate to project root.

## 🧪 Testing

- [ ] **Unit Tests** – Isolated component tests.
- [ ] **Integration Tests** – Service/API layer tests.
- [ ] **E2E Tests** – Full user-flow testing (e.g., Cypress).

## 🔄 Miscellaneous

- [ ] **Username Queries** – Prefer `username` over `userId` where possible.

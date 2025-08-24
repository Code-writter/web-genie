# Web-Genie

Web-Genie is a modern web application that allows users to create and manage projects through an intuitive chat-like interface. Describe your project in natural language, and Web-Genie will help you generate and view code snippets in a sandbox environment.

## ✨ Features

- **Natural Language Interface**: Describe your project in plain English
- **Code Generation**: Generate code snippets based on your descriptions
- **Sandbox Environment**: View and interact with your generated code
- **Project Management**: Organize your work into projects
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme support

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 15 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI Components

- **Backend**:
  - tRPC for type-safe APIs
  - Prisma ORM
  - PostgreSQL Database
  - Inngest for background jobs
  - E2B for sandbox environment
  - OpenAI for code generation
  

- **Development Tools**:
  - ESLint + Prettier for code quality
  - Turbopack for fast development
  - pnpm for package management

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or later
- PostgreSQL database (NeonDB recommended)
- pnpm (recommended) or npm/yarn
- Inngest account
- E2B account
- OpenAI API key (4.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/web-genie.git
   cd web-genie
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other settings.

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   # or
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app
    ├── api
    │   ├── inngest
    │   │   └── route.ts
    │   └── trpc
    │   │   └── [trpc]
    │   │       └── route.ts
    ├── client.tsx
    ├── globals.css
    ├── layout.tsx
    ├── page.tsx
    └── project
    │   └── [projectId]
    │       └── page.tsx
├── components.json
├── components
    ├── code-view
    │   ├── code-theme.css
    │   └── index.tsx
    ├── file-explorar.tsx
    ├── hint.tsx
    ├── loader.tsx
    ├── tree-view.tsx
    └── ui
├── hooks
    └── use-mobile.ts
├── inngest
    ├── client.ts
    ├── functions.ts
    └── utils.ts
├── lib
    ├── db.ts
    └── utils.ts
├── modules
    ├── messages
    │   └── server
    │   │   └── procedures.ts
    └── projects
    │   ├── server
    │       └── procedures.ts
    │   └── ui
    │       ├── components
    │           ├── fragment-web.tsx
    │           ├── message-loading.tsx
    │           ├── project-header.tsx
    │           ├── prompt-card.tsx
    │           ├── prompt-container.tsx
    │           └── prompt-form.tsx
    │       └── views
    │           └── project-view.tsx
├── package.json
├── prisma
    ├── migrations
    │   └── migration_lock.toml
    └── schema.prisma
├── prompt
    └── prompt.ts
├── providers
    └── theme-provider.tsx
├── public
    └── logo
    │   ├── lightMode100.svg
    │   ├── lightMode50.svg
    │   └── logo.svg
├── sandbox-templates
    └── nextjs
    │   ├── compile.sh
    │   ├── e2b.Dockerfile
    │   └── e2b.toml
├── trpc
    ├── client.tsx
    ├── init.ts
    ├── query-client.ts
    ├── routers
    │   └── _app.ts
    └── server.tsx

└── types
    ├── agent-interfaces.ts
    └── types.ts

```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- E2B Sandbox by [E2B](https://e2b.dev/)
- Inngest by [Inngest](https://www.inngest.com/)

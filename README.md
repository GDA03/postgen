# ⚡ PostGen — AI-Powered LinkedIn Post Generator

> Generate professional LinkedIn posts from your project directory in seconds.  
> `npx postgen ./my-project` → LinkedIn-ready caption + visual card assets

---

## 🚀 Features

- 🔍 **Automatic Project Scanning** — detects tech stack, frameworks, LOC, git history, README, and project structure
- 🤖 **Multi-Provider AI (BYOK)** — bring your own API key for Gemini, OpenAI, Anthropic, or OpenRouter
- ✍️ **Multi-Variation Captions** — generates 3 distinct caption angles per run (storytelling, technical, concise)
- 🎨 **Visual Template Cards** — auto-generates 1200×628px LinkedIn cards (modern-dark & minimal templates)
- 💻 **CLI & Local Web UI** — terminal-first CLI or local interactive dashboard (`postgen serve`)
- 📦 **Monorepo Ready** — scan individual packages within monorepos (`--package=apps/web`)

---

## 🛠️ Quick Start

```bash
# Generate LinkedIn post from any project directory
npx postgen ./my-project

# Set your AI API key (Gemini, OpenAI, Anthropic, or OpenRouter)
npx postgen config set provider gemini
npx postgen config set apiKey your-api-key

# Launch local Web Dashboard
npx postgen serve
```

---

## 💻 CLI Usage

```bash
# 🎯 Interactive CLI Menu (keyboard arrow-key navigation)
npx postgen
# or
npx postgen -i

# 🚀 Direct post generation
postgen ./my-project

# ⚙️ Custom options
postgen generate ./my-project --tone=storytelling --length=medium --lang=en --variations=3

# 📦 Monorepo package scanning
postgen generate ./my-monorepo --package=apps/web

# 🖼️ Generate template card only
postgen card ./my-project --template=modern-dark

# 🌐 Launch local Web Dashboard from CLI menu or directly
postgen serve

# 🔑 Configure API key and provider
postgen config set provider gemini
postgen config set apiKey your-api-key
postgen config list
```

---

## 🏗️ Architecture

PostGen is built as a TypeScript monorepo using `pnpm` workspaces and `Turborepo`:

- `cli` (`postgen`) — Commander-based CLI tool
- `apps/web` (`@postgen/web`) — Next.js 15 local web dashboard
- `packages/core` (`@postgen/core`) — Project scanner, caption generator, card generator
- `packages/ai` (`@postgen/ai`) — Multi-provider AI SDK abstraction
- `packages/shared` (`@postgen/shared`) — Shared TypeScript types, constants, utilities

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on setting up the dev environment.

---

## 📜 License

[MIT License](./LICENSE) © 2026 PostGen Contributors

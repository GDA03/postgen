# Contributing to PostGen

Thank you for your interest in contributing to PostGen!

## Development Setup

### Prerequisites
- Node.js >= 22
- pnpm >= 9

### Getting Started

```bash
# Clone the repository
git clone https://github.com/postgen/postgen.git
cd postgen

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run unit tests
pnpm test

# Run typecheck
pnpm typecheck
```

### Running Locally

```bash
# Test CLI
cd cli && node dist/index.js --help

# Start Web UI dev server
pnpm dev --filter=@postgen/web
```

## Adding a Card Template

1. Add your template in `packages/core/src/cards/templates/<template-name>.ts`.
2. Register it in `packages/core/src/cards/index.ts`.
3. Add unit tests in `packages/core/src/cards/__tests__/`.

## Code Style

- Format code using `pnpm format`.
- Ensure `pnpm lint` and `pnpm typecheck` pass cleanly.

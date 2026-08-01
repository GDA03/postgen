### Task 1: Monorepo Scaffolding

**Files:**
- Create: `package.json` (root)
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`
- Create: `.gitignore`
- Create: `.npmrc`

**Interfaces:**
- Produces: Working monorepo with `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck` commands

- [ ] **Step 1: Create root package.json**

```jsonc
// package.json
{
  "name": "postgen-monorepo",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.15.9",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,json,md}\"",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean",
    "release": "changeset publish",
    "version-packages": "changeset version"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "turbo": "^2.3.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create workspace config files**

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
  - "cli"
```

```jsonc
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "lint:fix": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 3: Create shared TypeScript config**

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create linting and formatting config**

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/', '.turbo/'],
};
```

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- [ ] **Step 5: Create .gitignore and .npmrc**

```gitignore
# .gitignore
node_modules/
dist/
.turbo/
.next/
*.tsbuildinfo
.env
.env.local
coverage/
```

```ini
# .npmrc
auto-install-peers=true
shamefully-hoist=false
```

- [ ] **Step 6: Install dependencies and verify**

```bash
pnpm install
```

Expected: Clean install with no errors

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: scaffold monorepo with pnpm, turborepo, typescript"
```

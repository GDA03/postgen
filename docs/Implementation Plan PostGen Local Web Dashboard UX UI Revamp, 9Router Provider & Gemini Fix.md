# Implementation Plan — PostGen Local Web Dashboard UX/UI Revamp, 9Router Provider & Gemini Fix

> **Goal:** Revamp the PostGen Local Web Dashboard (`@postgen/web`) with a state-of-the-art glassmorphic UI, split-screen Studio layout, real-time LinkedIn post preview, **interactive live card customizer**, **1-click combined exporter**, **LinkedIn engagement length indicator**, **single-variation regenerator**, **9Router Provider support (`http://localhost:9000/v1`)**, smart user flow enhancements (interactive stepper, 1-click style presets, path shortcuts, onboarding banner, and post history), and fix the Google Gemini API default model (`gemini-2.0-flash`).

---

## 1. Problem & Comprehensive UX Enhancements

### 1.1 9Router AI Provider Support
- **Requirement:** Add **9Router** as a first-class AI Provider in PostGen.
- **Implementation:** 9Router uses OpenAI-compatible protocol locally (default `http://localhost:9000/v1`).
- **User Experience:** Selecting "9Router" in settings pre-fills `http://localhost:9000/v1` as the endpoint, allowing zero-key or custom local routing without external API fees.

### 1.2 Gemini Model Error Fix
- **Issue:** `@postgen/ai` used `gemini-2.5-flash` as default, returning an API error from Google (`This model models/gemini-2.5-flash is no longer available`).
- **Fix:** Update default Gemini model ID to `gemini-2.0-flash` (and support `gemini-1.5-flash`).

### 1.3 Supercharged UX & Flow Features
To make PostGen the ultimate LinkedIn content studio:
1. **Interactive Stepper Navigator (`1. Scan Project` → `2. Choose Style` → `3. Studio & Export`):**
   - Clear visual progress bar indicating current step with smooth auto-scroll.
2. **Inline Onboarding Banner:**
   - Detects missing provider/key and shows a 1-click modal setup banner.
3. **Quick Path Shortcuts & Auto-Fill:**
   - `"📍 Current Directory (.)"` button and chips for recently scanned projects.
4. **Smart One-Click Style Presets:**
   - Presets (*Viral Story*, *Tech Deep Dive*, *Concise Showcase*) that configure tone, length, language, and focus in 1-click.
5. **Live Interactive Card Customizer Studio:**
   - Live color palette switcher (`Modern Dark`, `Cyberpunk Neon`, `Ocean Gradient`, `Sunset Gold`, `Minimal Clean`).
   - Live editable title/subtitle directly on the card preview before downloading.
6. **LinkedIn Best-Practice Engagement Meter & Interactive Hashtags:**
   - Real-time character count meter with engagement indicator:
     - 🟢 Ideal (300–1200 chars — highest LinkedIn reach)
     - 🟡 Good (1200–2500 chars)
     - 🔴 Exceeds limit (> 3000 chars)
   - Interactive hashtag pills (click to append or remove from post text).
7. **Single-Variation Regenerator:**
   - `"🔄 Regenerate This Angle"` button to re-run AI generation for only the current variation without re-generating all 3.
8. **One-Click Combined Package Exporter:**
   - `"⚡ Copy Caption & Download Card"` master button + export as Markdown bundle.
9. **Floating Glassmorphic Toast Notifications:**
   - Elegant toast alerts for copy, download, and config save events.
10. **Post History (LocalStorage):**
    - Saves recent generated posts so users can switch back to previous generations anytime.

---

## 2. Proposed Code Changes

### Component 1: `@postgen/shared` & `@postgen/ai` — 9Router Provider & Gemini Fix
- [MODIFY] [types.ts](file:///c:/Users/alber/Downloads/Ngoding/postgen/packages/shared/src/types.ts):
  - Add `'9router'` to `AIProvider` type (`'gemini' | 'openai' | 'anthropic' | 'openrouter' | '9router' | 'custom'`).
- [MODIFY] [providers.ts](file:///c:/Users/alber/Downloads/Ngoding/postgen/packages/ai/src/providers.ts):
  - Update `DEFAULT_MODELS.gemini` to `'gemini-2.0-flash'`.
  - Add `case '9router':` using `createOpenAI` pointing to `config.baseUrl ?? 'http://localhost:9000/v1'`.
- [MODIFY] [providers.test.ts](file:///c:/Users/alber/Downloads/Ngoding/postgen/packages/ai/src/__tests__/providers.test.ts):
  - Add unit tests for `9router` provider creation and Gemini model default.

---

### Component 2: `@postgen/web` — Design System & Global Styles
- [MODIFY] [globals.css](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/app/globals.css):
  - Add design tokens (custom HSL color palette, glassmorphism backdrop blurs, glow shadows, custom scrollbars, animated keyframes).
  - Add utility classes (`.glass-panel`, `.gradient-text`, `.badge-pill`, `.tab-item`, `.glow-button`, `.stepper-step`, `.toast-container`).

---

### Component 3: `@postgen/web` — Flow & Studio UI Components
- [NEW] [toast.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/toast.tsx):
  - Floating toast notification component with auto-dismiss.
- [NEW] [stepper.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/stepper.tsx):
  - Interactive top progress stepper (`1. Scan Project` → `2. Select Style` → `3. Studio & Export`).
- [NEW] [onboarding-banner.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/onboarding-banner.tsx):
  - Friendly API key / 9Router setup banner when unconfigured.
- [MODIFY] [project-input.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/project-input.tsx):
  - Add `"📍 Current Directory"` quick button, clear button, and recent project chips.
- [NEW] [project-overview.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/project-overview.tsx):
  - Visual summary card for scanned project (LOC gauge, language percentage bars, framework badges, git commit stats).
- [NEW] [presets-picker.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/presets-picker.tsx):
  - 1-click preset cards (*Viral Story*, *Tech Deep Dive*, *Concise Showcase*) that configure tone, length, language, and focus simultaneously.
- [MODIFY] [caption-editor.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/caption-editor.tsx):
  - Tabbed variation switcher with angle badges (`Storytelling`, `Technical`, `Concise`).
  - Copy status toast, character count progress meter with engagement indicator, single-variation regenerator button, and interactive hashtag pills.
- [MODIFY] [post-preview.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/post-preview.tsx):
  - Pixel-perfect LinkedIn feed post container with realistic user profile, formatted body, hashtags, and social engagement bar.
- [MODIFY] [card-selector.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/card-selector.tsx):
  - Live color palette switcher, title/subtitle customizer, interactive template preview grid (`modern-dark`, `minimal`), live card generator, and master `"⚡ Copy Caption & Download Card"` exporter.
- [MODIFY] [settings-panel.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/components/settings-panel.tsx):
  - Include `9router` option with default base URL `http://localhost:9000/v1` and model dropdown suggestions.
- [MODIFY] [page.tsx](file:///c:/Users/alber/Downloads/Ngoding/postgen/apps/web/app/page.tsx):
  - Assemble the complete Revamped Studio Workspace with sticky header, persistent status bar, stepper navigator, onboarding banner, presets, post history, toasts, and split-screen studio layout.

---

## 3. Verification Plan

### Automated Tests
- Run `@postgen/ai` test suite (including 9Router tests):
  ```bash
  pnpm --filter=@postgen/ai test
  ```
- Run full monorepo typecheck & test suite:
  ```bash
  pnpm typecheck
  pnpm test
  ```

### Manual & Build Verification
- Verify Next.js production build:
  ```bash
  pnpm --filter=@postgen/web build
  ```
- Test local execution via CLI:
  ```bash
  postgen serve
  ```
  Verify http://localhost:7678 loads the new flow-enhanced glassmorphic UI, 9Router option works, single variation regenerator works, and Gemini post generation succeeds cleanly.

# Contributing to SwiftLog 🎒🎨

Thank you for your interest in contributing to SwiftLog! Whether it's a bug fix, a new feature, or an improvement to the docs — all contributions are welcome.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Commit Message Convention](#commit-message-convention)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Roadmap](#roadmap)

---

## Code of Conduct

This project follows a simple rule: **be respectful**. Constructive feedback, healthy debate, and inclusive collaboration are encouraged. Harassment or dismissive behaviour of any kind will not be tolerated.

---

## Getting Started

### Prerequisites

| Tool | Required Version |
|---|---|
| Node.js | **≥ 20.18.1** |
| npm | ≥ 10.x |
| VS Code | ≥ 1.80.0 |

> ⚠️ Node 18 will **not** work for packaging. Use [nvm](https://github.com/nvm-sh/nvm) to switch easily:
> ```bash
> nvm install 20
> nvm use 20
> ```

### Fork & Clone

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/SwiftLog.git
cd SwiftLog

# 2. Install dependencies
npm install
```

### Run in Development Mode

Press `F5` in VS Code to open an **Extension Development Host** — a sandboxed VS Code window where SwiftLog is live-loaded. Any change you make + recompile will reflect immediately there.

```bash
# Watch mode (auto-recompiles on save)
npm run watch
```

---

## Project Structure

```
SwiftLog/
├── src/
│   └── extension.ts        # All extension logic lives here
├── images/
│   └── SwiftLog.png        # Marketplace icon
├── out/                    # Compiled JS output (git-ignored)
├── package.json            # Extension manifest & contributes
├── tsconfig.json           # TypeScript config
├── .vscodeignore           # Files excluded from the packaged VSIX
└── README.md
```

> **Core file:** `src/extension.ts` is the single source of truth. It handles command registration, AST parsing via `@babel/parser` + `@babel/traverse`, context detection, log injection, and log removal.

---

## Development Workflow

### 1. Create a Branch

Always branch off `main`. Use descriptive branch names:

```bash
git checkout -b feat/circular-reference-support
git checkout -b fix/empty-line-detection-edge-case
git checkout -b docs/update-contributing
```

### 2. Make Your Changes

- Keep changes **focused** — one feature or fix per PR.
- If you're adding a new command, register it in both `src/extension.ts` **and** `package.json` under `contributes.commands` and `contributes.keybindings`.
- If you add a new configurable setting, add it under `contributes.configuration.properties` in `package.json` and read it via `vscode.workspace.getConfiguration('swiftlog')`.

### 3. Compile & Test Locally

```bash
# One-off compile
npm run compile

# Package a VSIX to install and test end-to-end
npx @vscode/vsce package --no-dependencies
# Produces swiftlog-x.x.x.vsix
```

Install the VSIX locally:
- Open VS Code → Extensions sidebar → `···` menu → **Install from VSIX…**

### 4. Manual Test Checklist

Before submitting, verify:

- [ ] Log injection works on a `.ts`, `.tsx`, `.js`, and `.jsx` file
- [ ] Context (Client / Server) is correctly detected
- [ ] Cursor-word detection works without any text selected
- [ ] Empty-line replacement works
- [ ] `JSON.stringify` shortcut wraps correctly
- [ ] **Remove All Logs** removes only SwiftLog-stamped logs
- [ ] **Remove Specific Log** correctly matches by variable name or ID
- [ ] No TypeScript compile errors (`npm run compile` exits cleanly)

---

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin your-branch-name
   ```
2. Open a Pull Request against the `main` branch of the upstream repo.
3. Fill in the PR template:
   - **What does this PR do?**
   - **How was it tested?**
   - **Screenshots / GIFs** (for UI or behaviour changes)
4. A maintainer will review and may request changes. Address feedback directly in the same branch.

> PRs without a clear description or that break the compile step will not be merged.

---

## Commit Message Convention

SwiftLog follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `refactor` | Code change that is neither a fix nor a feature |
| `chore` | Build process, dependency updates, tooling |
| `test` | Adding or updating tests |

**Examples:**

```
feat(parser): add circular reference detection for stringify
fix(removal): handle multi-line log deletion correctly
docs(readme): update shortcut table for Windows
chore(deps): bump @babel/traverse to 7.25.0
```

---

## Reporting Bugs

Before opening an issue, please check the [existing issues](https://github.com/Aayush540-tech/SwiftLog/issues) to avoid duplicates.

When filing a bug report, include:

- **VS Code version** (Help → About)
- **SwiftLog version**
- **OS** (macOS / Windows / Linux)
- **File type** where the bug occurred (`.ts`, `.jsx`, etc.)
- **Steps to reproduce** — be precise
- **Expected vs. actual behaviour**
- **Snippet of the code** you were working on (if applicable)

---

## Suggesting Features

Open a [GitHub Discussion](https://github.com/Aayush540-tech/SwiftLog/discussions) or an Issue tagged `enhancement`. Describe:

- The **problem** you're trying to solve
- Your **proposed solution**
- Any **alternatives** you considered

Check the [Roadmap](#roadmap) first — your idea may already be planned.

---

## Roadmap

Features planned for upcoming releases:

| Status | Feature |
|---|---|
| ✅ Done | Smart `JSON.stringify` override shortcut |
| 🔲 Planned | Circular reference-safe stringifier |
| 🔲 Planned | Full-workspace log sweep across all open files |
| 🔲 Planned | Log level support (`console.error`, `console.warn`, `console.table`) |

If you want to work on a planned item, **comment on the related issue** first so we can coordinate and avoid duplicate effort.

---

*Built for unparalleled developer experience. Happy hacking! 🚀*

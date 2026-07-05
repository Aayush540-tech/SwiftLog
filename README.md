# LogFlow 🎒🎨

> A context-aware, AST-powered log injection extension for VS Code.

**LogFlow** eliminates the friction of manually typing out debugging statements in complex React and Next.js codebases. Using advanced Babel AST parsing, LogFlow precisely analyzes your current execution scope, determines your environment (Client vs. Server), and instantly injects a beautifully formatted, context-aware `console.log` directly below your cursor — or at any line you specify.

---

## ⚡️ Key Features

- **AST-Powered Precision**: Extracts the exact enclosing function, class method, or arrow function to tell you *exactly* where a log fired.
- **Next.js Context Awareness**: Natively detects `"use client"` and `"use server"` directives (and intelligently maps App Router paths as a fallback) to adapt log output automatically.
- **Premium Formatting**:
  - **Server Components**: `🎒 [SERVER] [FunctionName] -> Variable: {value}`
  - **Client Components**: `%c🎨 [CLIENT] [FunctionName] -> Variable:` with bright CSS styling in DevTools.
- **Unique Log Stamping**: Every injected log is stamped with a unique `// [LogFlow:XXXX]` signature for easy identification and safe pruning.
- **Smart Log Removal**: Remove all LogFlow logs or a specific one from the active file in a single command, without touching your own `console.log`s.
- **Fully Customizable**: Override emojis, hex colors, and line number display directly from VS Code Settings UI.

---

## 🚀 Usage

### Inject a Log
1. Open any `.ts`, `.tsx`, `.js`, or `.jsx` file.
2. **Select a variable name** you want to inspect (e.g. `userData`).
3. Fire the keyboard shortcut:

| Shortcut (Mac) | Shortcut (Win/Linux) | Action |
|---|---|---|
| `Cmd + Alt + L` | `Ctrl + Alt + L` | **Insert Context-Aware Log** |
| `Cmd + Shift + Alt + D` | `Ctrl + Shift + Alt + D` | **Remove All LogFlow Logs** |
| `Cmd + Shift + Alt + X` | `Ctrl + Shift + Alt + X` | **Remove Specific Log** |

Alternatively, open the Command Palette (`Cmd+Shift+P`) and search for **"LogFlow"** to see all available commands.

---

## ⚙️ Customization

Go to **VS Code Settings** (`Cmd + ,`) and search for **LogFlow** to customize:

| Setting | Type | Default | Description |
|---|---|---|---|
| `logflow.clientEmoji` | `string` | `🎨` | Emoji prefix for Client Components |
| `logflow.serverEmoji` | `string` | `🎒` | Emoji prefix for Server Components |
| `logflow.clientColor` | `string` | `#00adb5` | Hex color for browser DevTools styling |
| `logflow.includeLineNumbers` | `boolean` | `false` | Append source line number to log signature |

### Example output with `includeLineNumbers: true`:
```typescript
console.log("%c🎨 [CLIENT] [UserProfile:L24] -> username:", "color: #00adb5; font-weight: bold;", username); // [LogFlow:X7J9]
```

---

## 🗑️ Removing Logs

LogFlow stamps every injected log with `// [LogFlow:XXXX]`, making cleanup safe and surgical:

- **Remove All Logs** (`Cmd+Shift+Alt+D`): Wipes every LogFlow-stamped log from the active file instantly.
- **Remove Specific Log** (`Cmd+Shift+Alt+X`): Prompts you for a variable name or Log ID (e.g. `username` or `X7J9`), and removes only the matching log(s).

---

## 🛠️ Tech Stack & Internal Mechanics

- Driven by the standard VS Code `TextEditor` API.
- employs `@babel/parser` and `@babel/traverse` to scan execution scopes without blocking the IDE thread.
- Implements fully graceful fallbacks — if your code has unresolved syntax errors mid-refactor, LogFlow still injects logs as expected.
- Log deletion uses a **two-pass reverse-order** scan to prevent line-index shifting during bulk deletions.

---

## 📦 Roadmap

- [ ] Smart `JSON.stringify(foo, null, 2)` toggle for object logging.
- [ ] Full-workspace log sweep across all open files.
- [ ] Log level support: `console.error`, `console.warn`, `console.table`.

---

*Built for unparalleled developer experience.*

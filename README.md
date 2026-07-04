# LogFlow 🎒🎨 

> A context-aware, AST-powered log injection extension for VS Code.

**LogFlow** eliminates the friction of manually typing out debugging statements in complex React and Next.js codebases. Using advanced Babel AST parsing, LogFlow precisely analyzes your current execution scope, determines your environment (Client vs. Server), and instantly injects a beautifully formatted, context-aware `console.log` directly below your cursor.

---

## ⚡️ Key Features

- **AST-Powered Precision**: Extracts the exact enclosing function, class method, or arrow snippet seamlessly to tell you *exactly* where a log fired.
- **Next.js Context Awareness**: Natively detects `"use client"` and `"use server"` directives (and intelligently heuristic-maps App Router paths) to adapt output natively. 
- **Premium formatting**:
  - **Server Components** output as node-native string literal blocks: `🎒 [SERVER] [FunctionName] -> Variable: {Variable}`
  - **Client Components** output dynamically styled browser-native CSS: `%c🎨 [CLIENT] ...` in bright #00adb5 for instant visual tracking.
- **Smart Idempotency**: Automatically stamps a unique UUID `// [LogFlow:X7R9]` signature so you can eventually prune debugging code globally before deployments.

## 🚀 Usage

1. Open a JavaScript, TypeScript, or JSX/TSX file.
2. Select or put your cursor on any variable name you wish to inspect (e.g. `const userData`).
3. Fire the keyboard shortcut:
   - **Mac**: `Cmd` + `Alt` + `L`
   - **Windows/Linux**: `Ctrl` + `Alt` + `L`
4. Alternatively, use the Command Palette (`Cmd+Shift+P`) and trigger: `LogFlow: Insert Context-Aware Log`.

Your highly contextualized log will instantly drop formatted beautifully onto the line immediately below your cursor.

---

## 🛠️ Tech Stack & Internal Mechanics
LogFlow runs highly-optimized natively inside VS Code:
- Driven by standard VS Code `TextEditor` APIs.
- Employs `@babel/parser` and `@babel/traverse` to scan code blocks without blocking the IDE engine.
- Implements completely graceful fallbacks. If your code is mid-refactor (broken syntax limits AST), LogFlow drops back efficiently and still logs gracefully.

## 📦 Upcoming Roadmap
- Support for customizable hex-themes / emoji toggles inside `settings.json`.
- A universal `Remove All Logs` production pruning sweep command.
- Smart expansions for `JSON.stringify(foo, null, 2)` output toggles.

---
*Developed for unparalleled developer experience.*

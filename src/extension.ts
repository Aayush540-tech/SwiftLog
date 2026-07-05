import * as vscode from 'vscode';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

// Ensure traverse works regardless of whether esModuleInterop is enabled
const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export function activate(context: vscode.ExtensionContext) {
    const insertLogCommand = vscode.commands.registerCommand('logflow.insertLog', async () => {
        const editor = vscode.window.activeTextEditor;

        // Failsafe: TextEditor is required
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        const highlightedText = document.getText(selection).trim();
        const fileUri = document.uri;
        const activeFilePath = fileUri.fsPath;
        const cursorLine = selection.active.line; // VS Code lines are 0-indexed

        if (!highlightedText) {
            vscode.window.setStatusBarMessage('$(warning) LogFlow: Please select a variable to inject a log for', 3000);
            return;
        }

        const sourceCode = document.getText();
        let functionName = 'Global';

        // -------------------------------------------------------------
        // Context Detection (Next.js Server Component vs standard client)
        // -------------------------------------------------------------
        let isServerContext = false;

        if (sourceCode.includes('"use server"') || sourceCode.includes("'use server'")) {
            isServerContext = true;
        } else if (sourceCode.includes('"use client"') || sourceCode.includes("'use client'")) {
            isServerContext = false;
        } else {
            // Fallback heuristic: assume Server Context if it's within Next.js /app directory (default Server Component)
            isServerContext = activeFilePath.includes('/app/') &&
                !activeFilePath.includes('.client.') &&
                (activeFilePath.endsWith('.tsx') || activeFilePath.endsWith('.ts'));
        }

        try {
            // -------------------------------------------------------------
            // Babel AST Integration
            // -------------------------------------------------------------
            const ast = parse(sourceCode, {
                sourceType: 'module',
                plugins: [
                    'typescript',
                    'jsx',
                    'decorators-legacy', // Often needed in robust Next.js / React projects
                    'importAssertions'
                ],
            });

            // Babel loc lines are 1-indexed natively
            const targetLine = cursorLine + 1;

            traverse(ast, {
                enter(path: any) {
                    const node = path.node;

                    // Scope traversal to nodes that encompass our cursor line
                    if (node.loc && node.loc.start.line <= targetLine && node.loc.end.line >= targetLine) {

                        // Check if the node is a function or method representing an execution block
                        if (
                            path.isFunctionDeclaration() ||
                            path.isFunctionExpression() ||
                            path.isArrowFunctionExpression() ||
                            path.isClassMethod() ||
                            path.isObjectMethod()
                        ) {
                            if (path.node.type === 'FunctionDeclaration' && path.node.id) {
                                functionName = path.node.id.name;
                            } else if ((path.node.type === 'ClassMethod' || path.node.type === 'ObjectMethod') && path.node.key.name) {
                                functionName = path.node.key.name;
                            } else if (path.parent && path.parent.type === 'VariableDeclarator' && path.parent.id.name) {
                                functionName = path.parent.id.name; // e.g., const myFunc = () => {}
                            } else if (path.parent && path.parent.type === 'AssignmentExpression' && path.parent.left.name) {
                                functionName = path.parent.left.name; // e.g., myFunc = function() {}
                            } else {
                                functionName = 'Anonymous';
                            }
                        }
                    }
                }
            });

            await injectLogStatement(editor, cursorLine, highlightedText, functionName, isServerContext);

        } catch (error) {
            // -------------------------------------------------------------
            // Error Prevention (Graceful Fallback on syntax errors)
            // -------------------------------------------------------------
            vscode.window.setStatusBarMessage('$(warning) LogFlow: AST parsing failed. Using standard insertion.', 5000);
            await injectLogStatement(editor, cursorLine, highlightedText, 'Unknown', isServerContext);
        }
    });

    context.subscriptions.push(insertLogCommand);
}

/**
 * Inserts the formatted log statement below the user's cursor.
 */
async function injectLogStatement(
    editor: vscode.TextEditor,
    line: number,
    variableName: string,
    functionName: string,
    isServerContext: boolean
) {
    const config = vscode.workspace.getConfiguration('logflow');
    const clientEmoji = config.get<string>('clientEmoji') || '🎨';
    const serverEmoji = config.get<string>('serverEmoji') || '🎒';
    const clientColor = config.get<string>('clientColor') || '#00adb5';
    const includeLineNums = config.get<boolean>('includeLineNumbers') || false;

    const document = editor.document;
    const currentLineText = document.lineAt(line).text;

    // Capture the existing whitespace margin to perfectly format the injected log
    const indentation = currentLineText.substring(0, currentLineText.length - currentLineText.trimStart().length);
    const logId = Math.random().toString(36).substring(2, 6).toUpperCase();

    // Map Dynamic Line Numbers
    let fnContext = `[${functionName}]`;
    if (includeLineNums) {
        fnContext = `[${functionName}:L${line + 2}]`; // line is 0-indexed, but inserts below cursor logically
    }

    let logString = '';

    if (isServerContext) {
        logString = `console.log("${serverEmoji} [SERVER] ${fnContext} -> ${variableName}:", ${variableName}); // [LogFlow:${logId}]`;
    } else {
        logString = `console.log("%c${clientEmoji} [CLIENT] ${fnContext} -> ${variableName}:", "color: ${clientColor}; font-weight: bold;", ${variableName}); // [LogFlow:${logId}]`;
    }

    await editor.edit(editBuilder => {
        // We use insert to place the log precisely on the line immediately below the cursor
        editBuilder.insert(new vscode.Position(line + 1, 0), `${indentation}${logString}\n`);
    });
}

export function deactivate() {
    // Teardown cleanup if necessary
}

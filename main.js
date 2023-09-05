// main.js
const vscode = require('vscode');


class PangDefinitionProvider {
    provideDefinition(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange);

        console.log(word);

        const text = document.getText();
        const macroRegex = new RegExp("macro\\s+(" + word + ")", "gm");

        let match;
        while ((match = macroRegex.exec(text))) {
            const macroName = match[1];
            // Check if the current line defines the macro being referenced
            if (macroName && macroName === word) {
                // Calculate the position of the macro definition
                const startPos = document.positionAt(match.index);

                // Return a Location object for the definition
                return new vscode.Location(document.uri, startPos);
            }
        }

        return null;
    }
}


class PangKeywordCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        let keywordCompletionItems = [
            {
                label: 'include',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Include another file.',
            },
            {
                label: 'macro',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Create a macro.',
            },
            {
                label: 'end',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'End a while loop/if statement/macro definition.',
            },
            {
                label: 'drop',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Removes the last item on the stack.',
            },
            {
                label: 'quote',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Pushes a pointer to the last item on the stack.',
            },
            {
                label: 'apply',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Dereference a pointer.',
            },
            {
                label: 'add',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Adds the last two items on the stack.',
            },
            {
                label: 'sub',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Subtracts the last two items on the stack.',
            },
            {
                label: 'mul',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Multiplies the last two items on the stack.',
            },
            {
                label: 'dup',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Duplicates the last item on the stack.',
            },
            {
                label: 'swap',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Swap the last two items on the stack.',
            },
            {
                label: 'while',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Start a while loop.',
            },
            {
                label: 'div',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Divides the last two items on the stack.',
            },
            {
                label: 'mod',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Performs a modulo operation on the last two items on the stack.',
            },
            {
                label: 'call',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Calls an external libc function or windows api function.',
            },
            {
                label: 'lshift',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Pops n off the stack and bitshifts the last item by n to the left.',
            },
            {
                label: 'rshift',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Pops n off the stack and bitshifts the last item by n to the right.',
            },
            {
                label: 'xor',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Performs an exclusive or operation on the last two items on the stack.',
            },
            {
                label: 'bor',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Performs a bitwise or operation on the last two items on the stack.',
            },
            {
                label: 'bnot',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Performs a bitwise not operation on the last two items on the stack.',
            },
            {
                label: 'band',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'Performs a bitwise and operation on the last two items on the stack.',
            }
        ];

        const text = document.getText();
        const macroRegex = new RegExp("macro\\s+(([_A-Za-z])([_A-Za-z0-9]*))", "gm");

        let match;
        while ((match = macroRegex.exec(text))) {
            const macroName = match[1];

            keywordCompletionItems.push({
                label: macroName,
                kind: vscode.CompletionItemKind.Constant,
                detail: 'macro ' + macroName + ' ... end',
            })
        }

        return keywordCompletionItems;
    }
}


function activate(context) {
    const languageId = 'pang'; // Replace with your language identifier
    const completionProvider = new PangKeywordCompletionProvider();
    const definitionProvider = new PangDefinitionProvider();

    // Register the completion provider for your custom language
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: languageId },
            completionProvider
        )
    );

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            { scheme: 'file', language: languageId },
            definitionProvider
        )
    );

    //context.subscripts.push(
    //    vscode.languages.registerColorProvider(
    //        { scheme: 'file', language: languageId },
    //        ColorProvider
    //    )
    //)
}


function deactivate() {}


module.exports = {
    activate,
    deactivate
};

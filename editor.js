require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

require(['vs/editor/editor.main'], function() {
    const editorContainer = document.getElementById('editor-container');
    const fileInput = document.getElementById('file-input');
    const openFileButton = document.getElementById('open-file-button');
    const saveFileButton = document.getElementById('save-file-button');
    const runCodeButton = document.getElementById('run-code-button');
    const outputContainer = document.getElementById('output-container');

    let editor = monaco.editor.create(editorContainer, {
        value: [
            '// Welcome to the code editor!',
            '// Click "Open File" to load a file or start typing.',
        ].join('\n'),
        language: 'javascript'
    });

    openFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileExtension = file.name.split('.').pop();
            const language = getLanguageFromExtension(fileExtension);

            editor.setValue(content);
            monaco.editor.setModelLanguage(editor.getModel(), language);
        };
        reader.readAsText(file);
    });

    saveFileButton.addEventListener('click', () => {
        const content = editor.getValue();
        const language = editor.getModel().getLanguageId();
        const extension = getExtensionFromLanguage(language);
        const fileName = prompt("Enter filename:", `code.${extension}`);
        if (!fileName) {
            return;
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    runCodeButton.addEventListener('click', async () => {
        const code = editor.getValue();
        const language = editor.getModel().getLanguageId();

        const confirmation = confirm("Warning: You are about to execute code in your browser. This could be dangerous if you don't trust the source of the code. Are you sure you want to continue?");

        if (confirmation) {
            outputContainer.innerText = "Executing code...";
            try {
                const response = await fetch('http://127.0.0.1:5000/run', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: code, language: language })
                });

                const data = await response.json();
                outputContainer.innerText = data.output;
            } catch (error) {
                console.error('Error running code:', error);
                outputContainer.innerText = "Error running code. See console for details.";
            }
        }
    });

    function getExtensionFromLanguage(language) {
        switch (language) {
            case 'javascript':
                return 'js';
            case 'typescript':
                return 'ts';
            case 'python':
                return 'py';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'markdown':
                return 'md';
            default:
                return 'txt';
        }
    }

    function getLanguageFromExtension(extension) {
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'py':
                return 'python';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            default:
                return 'plaintext';
        }
    }
});

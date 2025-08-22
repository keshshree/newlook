require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});

require(['vs/editor/editor.main'], function() {
    const editorContainer = document.getElementById('editor-container');
    const fileInput = document.getElementById('file-input');
    const openFileButton = document.getElementById('open-file-button');
    const saveFileButton = document.getElementById('save-file-button');

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
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.txt'; // Default filename
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

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

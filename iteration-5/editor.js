// const { editor } = require("monaco-editor");

function initMonaco(id, language, lines) {

  const container = document.getElementById('container-' + id);
  console.log(`init Monaco container = ${container?.id}`);
  const editor = monaco.editor.create(container, {
    value: lines ? lines.join('\n') : '',
    language: language,
    fontSize: "18px",
    theme: 'vs-dark',
    lineNumbers: 'on',
    automaticLayout: true, // built-in auto resize to parent container
    scrollBeyondLastLine: false,
    readOnly: false
  });

  console.log(`init Monaco editor = ${editor?.id}`);
  editor.addAction({
    id: 'loadFile',
    label: 'Load file ...',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.o],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.0,
    run: function () {
      fileReader.open();
      return null;
    }
  });
}

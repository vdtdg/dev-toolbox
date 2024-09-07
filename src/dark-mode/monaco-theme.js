export function setEditorTheme(monaco) {
  monaco.editor.defineTheme('custom-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#f3f3f3'
    }
  });

  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#2a2a2a'
    }
  });
}
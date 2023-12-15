import * as monaco from 'monaco-editor';
import { useCallback } from 'react';

function useK8sYamlEditor() {

  const foldSymbol = useCallback(function (editor: monaco.editor.IStandaloneCodeEditor, symbol: string) {
    const model = editor.getModel();

    const matchs = model?.findMatches(
      symbol,
      false,
      false,
      false,
      '',
      false
    ).filter(match => match.range.startColumn === 1) || [];

    return new Promise(async (resolve, reject) => {
      try {
        for (const match of matchs) {
          const lineNumber = match.range.startLineNumber;

          editor.setPosition({ lineNumber, column: 1 });
          await editor.getAction('editor.fold').run();
        }

        resolve(null);
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const fold = useCallback(async function (editor: monaco.editor.IStandaloneCodeEditor) {
    await editor.getAction('editor.unfoldAll').run();
    const symbols = [
      '  annotations:',
      '  managedFields:',
      'status:',
      '    kubectl.kubernetes.io/last-applied-configuration:'
    ];

    for (const symbol of symbols) {
      await foldSymbol(editor, symbol);
    }

    editor.setScrollPosition({scrollTop: 0});
  }, [foldSymbol]);

  return {
    fold,
  };
}

export default useK8sYamlEditor;

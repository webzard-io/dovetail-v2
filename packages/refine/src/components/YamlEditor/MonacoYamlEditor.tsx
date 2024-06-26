import { cx } from '@linaria/core';
import { type JSONSchema7 } from 'json-schema';
import _ from 'lodash-es';

import * as monaco from 'monaco-editor';
import { setDiagnosticsOptions } from 'monaco-yaml';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { YamlEditorStyle } from './style';
import YamlWorker from './yaml.worker?worker';

type Props = {
  className?: string;
  id?: string;
  defaultValue: string;
  height?: string;
  onChange?: (val: string) => void;
  onValidate?: (valid: boolean, schemaValid: boolean) => void;
  isScrollOnFocus?: boolean;
  onEditorCreate?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onBlur?: () => void;
  getInstance?: (ins: monaco.editor.IStandaloneCodeEditor) => void;
  schema?: JSONSchema7;
  readOnly?: boolean;
};

if (!import.meta.env.PROD) {
  window.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      switch (label) {
        // Handle other cases
        case 'yaml':
          return new YamlWorker();
        default:
          throw new Error(`Unknown label ${label}`);
      }
    },
  };
}

const schemaMap = new Map();

const MonacoYamlEditor: React.FC<Props> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ editor: monaco.editor.IStandaloneCodeEditor | null }>({ editor: null });
  const {
    defaultValue,
    id,
    height,
    readOnly,
    schema,
    isScrollOnFocus,
    onChange,
    onValidate,
    getInstance,
    onEditorCreate,
    onBlur,
  } = props;
  const uri = id ? monaco.Uri.parse(`${id}.yaml`) : undefined;

  useEffect(() => {
    if (schema) {
      schemaMap.set(id, {
        // Id of the first schema
        uri: String(uri),
        // Associate with our model
        fileMatch: uri ? [String(uri)] : [],
        schema,
      });
    }
    const schemas = [...schemaMap.values()];
    // config monaco yaml
    setDiagnosticsOptions({
      enableSchemaRequest: false,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      isKubernetes: true,
      schemas,
    });

    const model = monaco.editor.createModel(defaultValue, 'yaml', uri);
    const editor = monaco.editor.create(ref.current!, {
      automaticLayout: true,
      scrollBeyondLastLine: false,
      model,
      scrollbar: {
        handleMouseWheel: !isScrollOnFocus,
        alwaysConsumeMouseWheel: false, // https://github.com/microsoft/monaco-editor/issues/2007
      },
      tabSize: 2,
      readOnly: readOnly,
      autoIndent: import.meta.env.VITE_IS_TEST ? 'none' : 'advanced',
    });

    instanceRef.current.editor = editor;
    getInstance?.(editor);
    onEditorCreate?.(editor);

    return () => {
      instanceRef.current.editor = null;
      schemaMap.delete(id);
      model.dispose();
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, id, readOnly, isScrollOnFocus, getInstance]);

  useEffect(() => {
    const editor = instanceRef.current.editor;

    if (editor) {
      const stop = editor.onDidChangeModelContent(() => {
        ReactDOM.unstable_batchedUpdates(() => {
          onChange?.(editor.getValue());
        });
      });

      return () => {
        stop.dispose();
      };
    }
  }, [onChange, instanceRef.current.editor]);

  useEffect(() => {
    const editor = instanceRef.current.editor;

    if (editor) {
      const stop = monaco.editor.onDidChangeMarkers((uri) => {
        const model = instanceRef.current.editor?.getModel();
        const currentEditorUri = model?.uri;

        if (model && uri.toString() === currentEditorUri?.toString()) {
          const marks = monaco.editor.getModelMarkers({ owner: 'yaml', resource: currentEditorUri });
          const yamlMarks = marks.filter(m => m.source === 'YAML');
          const schemaMarks = marks.filter(m => m.source !== 'YAML');
          const yamlValid = yamlMarks.length === 0;
          const schemaValid = schemaMarks.length === 0;

          onValidate?.(yamlValid, schemaValid);

          if (marks.some(mark => mark.source?.includes('yaml-schema'))) {
            monaco.editor.setModelMarkers(model, 'yaml', marks.map(mark => ({ ...mark, source: '', resource: {} })));
          }
        }
      });

      return () => {
        stop.dispose();
      };
    }

  }, [onValidate, instanceRef.current.editor]);

  useEffect(() => {
    const editor = instanceRef.current.editor;

    if (editor) {
      const stop = editor.onDidBlurEditorWidget(() => {
        ReactDOM.unstable_batchedUpdates(() => {
          onBlur?.();
        });
      });

      return () => {
        stop.dispose();
      };
    }
  }, [onBlur, instanceRef.current.editor]);

  useEffect(() => {
    const editor = instanceRef.current.editor;
    const stops: monaco.IDisposable[] = [];

    if (editor && isScrollOnFocus) {
      stops.push(editor.onDidFocusEditorWidget(() => {
        editor.updateOptions({
          scrollbar: {
            handleMouseWheel: true,
          }
        });
      }));
      stops.push(editor.onDidBlurEditorWidget(() => {
        editor.updateOptions({
          scrollbar: {
            handleMouseWheel: false,
          }
        });
      }));
    }

    return () => {
      stops.forEach(stop => stop.dispose());
    };
  }, [instanceRef.current.editor, isScrollOnFocus]);

  return (
    <div
      ref={ref}
      className={cx(YamlEditorStyle, props.className)}
      style={{
        width: '100%',
        height: height || '500px',
      }}
    />
  );
};

export default MonacoYamlEditor;

import { cx } from '@linaria/core';
import yaml from 'js-yaml';
import { type JSONSchema7 } from 'json-schema';
import _ from 'lodash-es';

import * as monaco from 'monaco-editor';
import { setDiagnosticsOptions } from 'monaco-yaml';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { YamlEditorStyle } from './style';
import YamlWorker from './yaml.worker?worker';

type Props<T extends string | Record<string, unknown> = string> = {
  className?: string;
  id?: string;
  defaultValue: T;
  height?: string;
  onChange?: (val: T) => void;
  onValidate?: (valid: boolean, schemaValid: boolean) => void;
  isScrollOnFocus?: boolean;
  onEditorCreate?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onBlur?: () => void;
  getInstance?: (ins: monaco.editor.IStandaloneCodeEditor) => void;
  schemas?: JSONSchema7[] | null;
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

export function MonacoYamlEditor<T extends string | Record<string, unknown> = string>(
  props: Props<T>
) {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ editor: monaco.editor.IStandaloneCodeEditor | null }>({
    editor: null,
  });
  const {
    defaultValue,
    id,
    height,
    readOnly,
    schemas,
    isScrollOnFocus,
    onChange,
    onValidate,
    getInstance,
    onEditorCreate,
    onBlur,
  } = props;
  const uri = id ? monaco.Uri.parse(`${id}.yaml`) : undefined;

  useEffect(() => {
    if (!window._MonacoSchemaMap) {
      window._MonacoSchemaMap = new Map();
    }

    window._MonacoSchemaMap.set(id || '', {
      // Id of the first schema
      uri: String(uri),
      // Associate with our model
      fileMatch: [String(uri)],
      schema: {
        oneOf: schemas || [{ type: 'object' }],
      },
    });

    const finalSchemas = [...window._MonacoSchemaMap.values()];

    // config monaco yaml
    setDiagnosticsOptions({
      enableSchemaRequest: false,
      validate: true,
      format: true,
      isKubernetes: true,
      schemas: finalSchemas,
    });

    const defaultValueString =
      typeof defaultValue === 'string' ? defaultValue : yaml.dump(defaultValue);
    const model = monaco.editor.createModel(defaultValueString, 'yaml', uri);
    const editor = monaco.editor.create(ref.current!, {
      automaticLayout: true,
      scrollBeyondLastLine: false,
      model,
      scrollbar: {
        handleMouseWheel: !isScrollOnFocus,
        alwaysConsumeMouseWheel: false, // https://github.com/microsoft/monaco-editor/issues/2007
      },
      tabSize: 2,
      lineNumbersMinChars: 7,
      readOnly: readOnly,
      autoIndent: import.meta.env.VITE_IS_TEST ? 'none' : 'advanced',
      theme: 'vs',
    });

    instanceRef.current.editor = editor;
    getInstance?.(editor);
    onEditorCreate?.(editor);

    return () => {
      instanceRef.current.editor = null;
      window._MonacoSchemaMap.delete(id || '');
      model.dispose();
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, schemas, readOnly, isScrollOnFocus, getInstance]);

  useEffect(() => {
    const editor = instanceRef.current.editor;

    if (editor) {
      const stop = editor.onDidChangeModelContent(() => {
        ReactDOM.unstable_batchedUpdates(() => {
          const editorValue = editor.getValue();
          // 保持原来传入值的类型
          const newValue = (
            typeof defaultValue === 'string' ? editorValue : yaml.load(editorValue) || {}
          ) as T;

          // 如果传入值为对象，则校验是否能解析 YAML 为对象，不能则报错
          if (typeof defaultValue !== 'string' && typeof newValue === 'string') {
            onValidate?.(false, true);
          } else {
            onValidate?.(true, true);
            onChange?.(newValue);
          }
        });
      });

      return () => {
        stop.dispose();
      };
    }
  }, [onChange, defaultValue]);

  useEffect(() => {
    const editor = instanceRef.current.editor;

    if (editor) {
      const stop = monaco.editor.onDidChangeMarkers(uri => {
        const model = instanceRef.current.editor?.getModel();
        const currentEditorUri = model?.uri;

        if (model && uri.toString() === currentEditorUri?.toString()) {
          const marks = monaco.editor.getModelMarkers({
            owner: 'yaml',
            resource: currentEditorUri,
          });
          const yamlMarks = marks.filter(m => m.source === 'YAML');
          const schemaMarks = marks.filter(m => m.source !== 'YAML');
          const yamlValid = yamlMarks.length === 0;
          const schemaValid = schemaMarks.length === 0;

          onValidate?.(yamlValid, schemaValid);

          if (marks.some(mark => mark.source?.includes('yaml-schema'))) {
            monaco.editor.setModelMarkers(
              model,
              'yaml',
              marks.map(mark => ({ ...mark, source: '', resource: {} }))
            );
          }
        }
      });

      return () => {
        stop.dispose();
      };
    }
  }, [onValidate]);

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
  }, [onBlur]);

  useEffect(() => {
    const editor = instanceRef.current.editor;
    const stops: monaco.IDisposable[] = [];

    if (editor && isScrollOnFocus) {
      stops.push(
        editor.onDidFocusEditorWidget(() => {
          editor.updateOptions({
            scrollbar: {
              handleMouseWheel: true,
            },
          });
        })
      );
      stops.push(
        editor.onDidBlurEditorWidget(() => {
          editor.updateOptions({
            scrollbar: {
              handleMouseWheel: false,
            },
          });
        })
      );
    }

    return () => {
      stops.forEach(stop => stop.dispose());
    };
  }, [isScrollOnFocus]);

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
}

export default MonacoYamlEditor;

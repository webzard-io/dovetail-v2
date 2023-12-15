import { useUIKit } from '@cloudtower/eagle';
import { Icon } from '@cloudtower/eagle';
import {
  ClipboardCopy16GradientGrayIcon,
  ClipboardCopy16GradientBlueIcon,
  HierarchyTriangleRight16GrayIcon,
  HierarchyTriangleRight16BlueIcon,
  Retry16GradientGrayIcon,
  Retry16GradientBlueIcon,
  XmarkFailedSeriousWarningFill16RedIcon,
  EditPen16GradientGrayIcon,
  EditPen16GradientBlueIcon,
  Showdiff16GradientGrayIcon,
  Showdiff16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { cx } from '@linaria/core';
import { JSONSchema7 } from 'json-schema';
import type * as monaco from 'monaco-editor';
import React, {
  Suspense,
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from '../Separator';
import {
  ErrorMsgStyle,
  IconStyle,
  PlainCodeStyle,
  TitleStyle,
  ToolBarStyle,
  ToolBarHeaderStyle,
  ErrorIconStyle,
  WrapperStyle,
  ErrorWrapperStyle,
} from './style';

const MonacoYamlEditor = React.lazy(() => import('./MonacoYamlEditor'));
const MonacoYamlDiffEditor = React.lazy(() => import('./MonacoYamlDiffEditor'));

export type YamlEditorProps = {
  eleRef?: React.MutableRefObject<HTMLDivElement>;
  title?: string;
  defaultValue?: string;
  errorMsgs?: string[];
  schema: JSONSchema7;
  id?: string;
  className?: string;
  height?: string;
  collapsable?: boolean;
  isDefaultCollapsed?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onValidate?: (valid: boolean, schemaValid: boolean) => void;
  onEditorCreate?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onBlur?: () => void;
};

export type YamlEditorHandle = {
  setValue: (value: string) => void;
  setEditorValue: (value: string) => void;
  getEditorValue: () => string;
  getEditorInstance: () => monaco.editor.IStandaloneCodeEditor | null;
};

export const YamlEditorComponent = forwardRef<YamlEditorHandle, YamlEditorProps>(
  function YamlEditorComponent(props, ref) {
    const {
      title,
      collapsable = true,
      isDefaultCollapsed,
      defaultValue = '',
      height,
      readOnly,
      errorMsgs = [],
      schema,
      eleRef,
      className,
    } = props;
    const kit = useUIKit();
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(
      collapsable ? isDefaultCollapsed : false
    );
    const [isDiff, setIsDiff] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();
    const [copyTooltip, setCopyTooltip] = useState(t('dovetail.copy'));
    const [resetTooltip, setResetTooltip] = useState(t('dovetail.reset_arguments'));

    useImperativeHandle(ref, () => {
      return {
        setValue,
        setEditorValue: (value: string) => {
          editorInstance.current?.getModel()?.setValue(value);
        },
        getEditorValue: () => {
          return editorInstance.current?.getValue() ?? '';
        },
        getEditorInstance: () => editorInstance.current || null,
      };
    });

    const onChange = useCallback(
      (newVal: string) => {
        setValue(newVal);
        props.onChange?.(newVal);
      },
      [props.onChange]
    );

    const onValidate = useCallback(
      (valid: boolean, schemaValid: boolean) => {
        props.onValidate?.(valid, schemaValid);
      },
      [props.onValidate]
    );

    const onEditorCreate = useCallback(
      (editor: monaco.editor.IStandaloneCodeEditor) => {
        if (editor.getValue() !== value) {
          editorInstance.current?.getModel()?.setValue(value);
        }

        props.onEditorCreate?.(editor);
      },
      [value, props.onEditorCreate]
    );

    const getInstance = useCallback((ins: monaco.editor.IStandaloneCodeEditor): void => {
      editorInstance.current = ins;
    }, []);

    return (
      <div
        className={cx(WrapperStyle, className)}
        data-is-error={!!errorMsgs.length}
        ref={eleRef}
      >
        <kit.space
          className={cx(ToolBarStyle, isCollapsed ? 'collapsed' : '')}
          direction="vertical"
          size={0}
        >
          <kit.space className={ToolBarHeaderStyle}>
            <kit.space size={8}>
              {collapsable && (
                <Icon
                  src={HierarchyTriangleRight16GrayIcon}
                  hoverSrc={HierarchyTriangleRight16BlueIcon}
                  className={cx(IconStyle, isCollapsed ? '' : 'arrow-down')}
                  iconWidth={16}
                  iconHeight={16}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                />
              )}
              <div className={cx(TitleStyle, 'yaml-editor-title')}>
                {title || t('dovetail.configure_file')}
              </div>
            </kit.space>
            <kit.space size={14}>
              {isDiff ? undefined : (
                <>
                  <kit.tooltip
                    title={isCollapsed ? '' : copyTooltip}
                    onVisibleChange={visible => {
                      if (!visible) {
                        setTimeout(() => {
                          setCopyTooltip(t('dovetail.copy'));
                        }, 80);
                      }
                    }}
                  >
                    <Icon
                      data-disabled={isCollapsed}
                      src={ClipboardCopy16GradientGrayIcon}
                      hoverSrc={isCollapsed ? undefined : ClipboardCopy16GradientBlueIcon}
                      className={IconStyle}
                      iconWidth={16}
                      iconHeight={16}
                      onClick={() => {
                        if (!isCollapsed) {
                          copyToClipboard(value);
                          setCopyTooltip(t('dovetail.copied'));
                        }
                      }}
                    />
                  </kit.tooltip>
                  <Separator />
                  <kit.tooltip
                    title={isCollapsed ? '' : resetTooltip}
                    onVisibleChange={visible => {
                      if (!visible) {
                        setTimeout(() => {
                          setResetTooltip(t('dovetail.reset_arguments'));
                        }, 80);
                      }
                    }}
                  >
                    <Icon
                      data-disabled={isCollapsed}
                      src={Retry16GradientGrayIcon}
                      hoverSrc={isCollapsed ? undefined : Retry16GradientBlueIcon}
                      className={IconStyle}
                      iconWidth={16}
                      iconHeight={16}
                      onClick={() => {
                        if (!isCollapsed) {
                          editorInstance.current?.setValue(defaultValue);
                          setResetTooltip(t('dovetail.already_reset'));
                        }
                      }}
                    />
                  </kit.tooltip>
                  <Separator />
                </>
              )}
              <kit.tooltip
                title={
                  isCollapsed
                    ? ''
                    : isDiff
                      ? t('dovetail.back_to_edit')
                      : t('dovetail.view_changes')
                }
              >
                {isDiff ? (
                  <Icon
                    data-disabled={isCollapsed}
                    src={EditPen16GradientGrayIcon}
                    hoverSrc={isCollapsed ? undefined : EditPen16GradientBlueIcon}
                    className={IconStyle}
                    iconWidth={16}
                    iconHeight={16}
                    onClick={() => (isCollapsed ? undefined : setIsDiff(false))}
                  />
                ) : (
                  <Icon
                    data-disabled={isCollapsed}
                    src={Showdiff16GradientGrayIcon}
                    hoverSrc={isCollapsed ? undefined : Showdiff16GradientBlueIcon}
                    className={IconStyle}
                    iconWidth={16}
                    iconHeight={16}
                    onClick={() => (isCollapsed ? undefined : setIsDiff(true))}
                  />
                )}
              </kit.tooltip>
            </kit.space>
          </kit.space>
          {errorMsgs.length ? (
            <kit.space className={ErrorWrapperStyle} size={8} align="start">
              <XmarkFailedSeriousWarningFill16RedIcon className={ErrorIconStyle} />
              <div>
                {errorMsgs.map((errorMsg, index) => (
                  <div className={ErrorMsgStyle} key={errorMsg}>
                    {errorMsgs.length > 1 ? `${index + 1}. ` : ''}
                    {errorMsg}
                  </div>
                ))}
              </div>
            </kit.space>
          ) : undefined}
        </kit.space>
        <div
          style={{
            display: isCollapsed ? 'none' : 'block',
            width: '100%',
            height: height || '500px',
            zIndex: 1,
          }}
        >
          {isDiff ? (
            <Suspense fallback={<pre className={PlainCodeStyle}>{value}</pre>}>
              <MonacoYamlDiffEditor
                id={props.id}
                origin={defaultValue}
                modified={value}
                height={height}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<pre className={PlainCodeStyle}>{value}</pre>}>
              <MonacoYamlEditor
                id={props.id}
                getInstance={getInstance}
                defaultValue={defaultValue}
                height={height}
                onChange={onChange}
                onValidate={onValidate}
                onEditorCreate={onEditorCreate}
                onBlur={props.onBlur}
                schema={schema}
                readOnly={readOnly}
              />
            </Suspense>
          )}
        </div>
      </div>
    );
  }
);

function copyToClipboard(text: string) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

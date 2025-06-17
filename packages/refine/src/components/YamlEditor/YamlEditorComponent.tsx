import { Space, Tooltip } from '@cloudtower/eagle';
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
import { debounce } from 'lodash-es';
import { type editor } from 'monaco-editor';
import React, {
  Suspense,
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useMemo,
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
  value?: string;
  defaultValue?: string;
  errorMsgs?: string[];
  schemas?: JSONSchema7[] | null;
  id?: string;
  className?: string;
  height?: string;
  collapsable?: boolean;
  isDefaultCollapsed?: boolean;
  readOnly?: boolean;
  debounceTime?: number;
  isScrollOnFocus?: boolean;
  onChange?: (value: string) => void;
  onValidate?: (valid: boolean, schemaValid: boolean) => void;
  onEditorCreate?: (editor: editor.IStandaloneCodeEditor) => void;
  onBlur?: () => void;
};

export type YamlEditorHandle = {
  setValue: (value: string) => void;
  setEditorValue: (value: string) => void;
  getEditorValue: () => string;
  getEditorInstance: () => editor.IStandaloneCodeEditor | null;
};

export const YamlEditorComponent = forwardRef<YamlEditorHandle, YamlEditorProps>(
  function YamlEditorComponent(props, ref) {
    const {
      title,
      collapsable = true,
      isDefaultCollapsed,
      value,
      defaultValue = '',
      height,
      readOnly,
      errorMsgs = [],
      schemas,
      eleRef,
      className,
      debounceTime,
      isScrollOnFocus = true,
    } = props;
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(
      collapsable ? isDefaultCollapsed : false
    );
    const [isDiff, setIsDiff] = useState(false);
    const [_value, _setValue] = useState(value || defaultValue);
    const editorInstance = useRef<editor.IStandaloneCodeEditor>();
    const [copyTooltip, setCopyTooltip] = useState(t('dovetail.copy'));
    const [resetTooltip, setResetTooltip] = useState(t('dovetail.reset_arguments'));

    useImperativeHandle(ref, () => {
      return {
        setValue: _setValue,
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
        _setValue(newVal);
        props.onChange?.(newVal);
      },
      [props.onChange]
    );
    const finalOnChange = useMemo(() => {
      return debounceTime ? debounce(onChange, debounceTime) : onChange;
    }, [onChange, debounceTime]);
    const onValidate = useCallback(
      (valid: boolean, schemaValid: boolean) => {
        props.onValidate?.(valid, schemaValid);
      },
      [props.onValidate]
    );
    const onEditorCreate = useCallback(
      (editor: editor.IStandaloneCodeEditor) => {
        if (editor.getValue() !== _value) {
          editorInstance.current?.getModel()?.setValue(_value);
        }

        props.onEditorCreate?.(editor);
      },
      [_value, props.onEditorCreate]
    );
    const getInstance = useCallback((ins: editor.IStandaloneCodeEditor): void => {
      editorInstance.current = ins;
    }, []);

    useEffect(() => {
      if (value !== undefined && value !== _value) {
        _setValue(value);
        editorInstance.current?.getModel()?.setValue(value);
      }
    }, [value]);

    return (
      <div
        className={cx(WrapperStyle, className)}
        data-is-error={!!errorMsgs.length}
        ref={eleRef}
      >
        <Space
          className={cx(ToolBarStyle, isCollapsed ? 'collapsed' : '')}
          direction="vertical"
          size={0}
        >
          <Space className={ToolBarHeaderStyle}>
            <Space size={8}>
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
            </Space>
            <Space size={14}>
              {isDiff ? undefined : (
                <>
                  <Tooltip
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
                          copyToClipboard(_value);
                          setCopyTooltip(t('dovetail.copied'));
                        }
                      }}
                    />
                  </Tooltip>
                  <Separator />
                  <Tooltip
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
                  </Tooltip>
                  <Separator />
                </>
              )}
              <Tooltip
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
              </Tooltip>
            </Space>
          </Space>
          {errorMsgs.length ? (
            <Space className={ErrorWrapperStyle} size={8} align="start">
              <XmarkFailedSeriousWarningFill16RedIcon className={ErrorIconStyle} />
              <div>
                {errorMsgs.map((errorMsg, index) => (
                  <pre className={ErrorMsgStyle} key={errorMsg}>
                    {errorMsgs.length > 1 ? `${index + 1}. ` : ''}
                    {errorMsg}
                  </pre>
                ))}
              </div>
            </Space>
          ) : undefined}
        </Space>
        <div
          style={{
            display: isCollapsed ? 'none' : 'block',
            width: '100%',
            height: height || '500px',
            zIndex: 1,
          }}
        >
          <Suspense fallback={<pre className={PlainCodeStyle}>{_value}</pre>}>
            <div style={{ display: isDiff ? 'none' : 'block' }}>
              <MonacoYamlEditor
                id={props.id}
                getInstance={getInstance}
                defaultValue={_value}
                height={height}
                onChange={finalOnChange}
                onValidate={onValidate}
                onEditorCreate={onEditorCreate}
                onBlur={props.onBlur}
                schemas={schemas}
                readOnly={readOnly}
                isScrollOnFocus={isScrollOnFocus}
              />
            </div>
          </Suspense>
          {isDiff ? (
            <Suspense fallback={<pre className={PlainCodeStyle}>{_value}</pre>}>
              <MonacoYamlDiffEditor
                id={props.id}
                origin={defaultValue}
                modified={_value}
                height={height}
              />
            </Suspense>
          ) : null}
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

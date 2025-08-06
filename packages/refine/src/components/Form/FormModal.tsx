import { CloseCircleFilled } from '@ant-design/icons';
import { usePopModal, usePushModal, Modal, Typo } from '@cloudtower/eagle';
import { ExclamationErrorCircleFill16RedIcon } from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { BaseRecord, CreateResponse, UpdateResponse, useResource } from '@refinedev/core';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { WarningButtonStyle } from 'src/styles/button';
import { FullscreenModalStyle } from 'src/styles/modal';
import { SmallModalStyle } from 'src/styles/modal';
import { FormType, FormMode, RefineFormConfig, CommonFormConfig } from 'src/types';
import { transformResourceKindInSentence } from 'src/utils/string';
import FormModeSegmentControl from './FormModeSegmentControl';
import RefineFormContainer from './RefineFormContainer';
import { YamlFormProps } from './YamlForm';
import YamlFormContainer from './YamlFormContainer';

const FormDescStyle = css`
  margin-bottom: 16px;
  max-width: var(--max-modal-width, 1024px);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;
const ErrorStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const TitleWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export type SaveButtonProps =
  | {
      disabled: boolean;
      onClick: (e: React.BaseSyntheticEvent) => void;
    }
  | {
      loading?:
        | boolean
        | {
            delay?: number | undefined;
          }
        | undefined;
      onClick?: (() => void) | undefined;
    };

export interface ConfirmModalProps {
  onOk?: () => void;
}

function ConfirmModal({ onOk }: ConfirmModalProps) {
  const { t } = useTranslation();
  const popModal = usePopModal();

  return (
    <Modal
      className={SmallModalStyle}
      width="414px"
      title={t('dovetail.edit_form')}
      okButtonProps={{
        type: 'primary',
        className: WarningButtonStyle,
      }}
      onOk={() => {
        onOk?.();
        popModal();
      }}
      okText={t('dovetail.confirm')}
      onCancel={popModal}
      destroyOnClose
    >
      <div className={Typo.Label.l2_regular}>{t('dovetail.exit_yaml_tip')}</div>
    </Modal>
  );
}

export type FormModalProps = {
  resource?: string;
  id?: string;
  yamlFormProps?: YamlFormProps;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
};

export function FormModal(props: FormModalProps) {
  const {
    resource: resourceFromProps,
    id,
    yamlFormProps: customYamlFormProps,
    onSuccess,
  } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const [saveButtonProps, setSaveButtonProps] = useState<SaveButtonProps>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [mode, setMode] = useState<FormMode>(FormMode.FORM);
  const isYamlMode = mode === FormMode.YAML;
  const popModal = usePopModal();
  const pushModal = usePushModal();
  const config = configs[resourceFromProps || resource?.name || ''];
  const isDisabledChangeMode =
    config.formConfig &&
    'isDisabledChangeMode' in config.formConfig &&
    config.formConfig.isDisabledChangeMode;
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');
  const action = id ? 'edit' : 'create';

  const isYamlForm = config.formConfig?.formType === FormType.YAML;

  const onCancel = useCallback(() => {
    popModal();
  }, [popModal]);
  const onOk = useCallback(
    e => {
      setIsError(false);
      saveButtonProps.onClick?.(e);
    },
    [saveButtonProps]
  );
  const onChangeMode = useCallback(
    (value: FormMode) => {
      if (value === FormMode.FORM) {
        pushModal<'ConfirmModal'>({
          component: ConfirmModal,
          props: {
            onOk: () => {
              setMode(FormMode.FORM);
            },
          },
        });
      } else {
        setMode(value);
      }
    },
    [pushModal]
  );

  const errorText = useMemo(() => {
    if (isError) {
      return i18n.t(id ? 'dovetail.save_failed' : 'dovetail.create_failed');
    }
    return '';
  }, [isError, id, i18n]);
  const title = useMemo(() => {
    if (typeof config.formConfig?.formTitle === 'string')
      return config.formConfig?.formTitle;

    if (typeof config.formConfig?.formTitle === 'function') {
      return config.formConfig?.formTitle(action);
    }
    const label = config.displayName || config?.kind;

    return i18n.t(id ? 'dovetail.edit_resource' : 'dovetail.create_resource', {
      resource: transformResourceKindInSentence(label, i18n.language),
    });
  }, [action, config.formConfig, config.displayName, config?.kind, i18n, id]);
  const desc = useMemo(() => {
    if (typeof config.formConfig?.formDesc === 'string')
      return config.formConfig?.formDesc;

    if (typeof config.formConfig?.formDesc === 'function') {
      return config.formConfig?.formDesc(action);
    }
    return '';
  }, [action, config.formConfig]);
  const formEle = useMemo(() => {
    const commonFormProps = {
      id: id as string,
      config,
      customYamlFormProps,
      onSaveButtonPropsChange: setSaveButtonProps,
      onError: () => {
        setIsError(true);
      },
      onSuccess: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => {
        setIsError(false);
        popModal();
        onSuccess?.(data);
      },
    };

    if (
      config.formConfig &&
      (config.formConfig?.formType === FormType.FORM || 'fields' in config.formConfig)
    ) {
      return (
        <RefineFormContainer
          {...commonFormProps}
          isYamlMode={isYamlMode}
          formConfig={config.formConfig as RefineFormConfig & CommonFormConfig}
        />
      );
    }

    return <YamlFormContainer {...commonFormProps} formConfig={config.formConfig} />;
  }, [
    id,
    customYamlFormProps,
    config,
    isYamlMode,
    popModal,
    setSaveButtonProps,
    onSuccess,
  ]);

  return (
    <Modal
      className={cx(FullscreenModalStyle)}
      style={
        {
          '--max-modal-width': isYamlForm || !isDisabledChangeMode ? '1024px' : '648px',
        } as React.CSSProperties
      }
      width="calc(100vw - 16px)"
      title={
        <div className={TitleWrapperStyle}>
          <span>{title}</span>
          {config.formConfig?.formType === FormType.FORM ? (
            <FormModeSegmentControl
              formConfig={config.formConfig}
              mode={mode}
              onChangeMode={onChangeMode}
            />
          ) : null}
        </div>
      }
      error={
        errorText ? (
          <div className={ErrorStyle}>
            <ExclamationErrorCircleFill16RedIcon /> {errorText}
          </div>
        ) : (
          ''
        )
      }
      okButtonProps={{
        ...saveButtonProps,
        children: config.formConfig?.saveButtonText,
        onClick: onOk,
      }}
      closeIcon={<CloseCircleFilled />}
      okText={okText}
      onCancel={onCancel}
      destroyOnClose
      fullscreen
    >
      {desc ? <div className={FormDescStyle}>{desc}</div> : undefined}
      {formEle}
    </Modal>
  );
}

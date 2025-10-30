import { usePopModal, usePushModal, Modal, Typo, WizardDialog } from '@cloudtower/eagle';
import { WizardDialogProps } from '@cloudtower/eagle/dist/src/core/WizardDialog/type';
import { css } from '@linaria/core';
import { BaseRecord, CreateResponse, UpdateResponse, useResource } from '@refinedev/core';
import { omit } from 'lodash-es';
import React, { useState, useContext, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { WarningButtonStyle } from 'src/styles/button';
import { SmallModalStyle } from 'src/styles/modal';
import { FormType, FormMode, RefineFormConfig, CommonFormConfig } from 'src/types';
import { transformResourceKindInSentence } from 'src/utils/string';
import FormModeSegmentControl from './FormModeSegmentControl';
import RefineFormContainer, { RefineFormContainerRef } from './RefineFormContainer';
import { YamlFormProps } from './YamlForm';
import YamlFormContainer from './YamlFormContainer';

const FormDescStyle = css`
  margin-bottom: 16px;
  max-width: var(--max-modal-width, 1024px);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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
  options?: {
    initialValues?: Record<string, unknown>;
    customOptions?: Record<string, unknown>;
  };
  modalProps?: WizardDialogProps;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
};

export function FormModal(props: FormModalProps) {
  const {
    resource: resourceFromProps,
    id,
    yamlFormProps: customYamlFormProps,
    modalProps,
    options,
    onSuccess,
  } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const [saveButtonProps, setSaveButtonProps] = useState<SaveButtonProps>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [mode, setMode] = useState<FormMode>(FormMode.FORM);
  const [step, setStep] = useState<number>(0);
  const isYamlMode = mode === FormMode.YAML;
  const refineFormContainerRef = useRef<RefineFormContainerRef>(null);
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
          ref={refineFormContainerRef}
          step={step}
          options={options}
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
    step,
    options,
    popModal,
    setSaveButtonProps,
    onSuccess,
  ]);
  const steps = useMemo(() => {
    if (isYamlMode) {
      return undefined;
    }

    if (config.formConfig && 'steps' in config.formConfig) {
      return config.formConfig?.steps?.map((step, index) => ({
        title: step.title,
        children: (
          <>
            {desc && index === 0 ? (
              <div className={FormDescStyle}>{desc}</div>
            ) : undefined}
            {formEle}
          </>
        ),
      }));
    }

    return undefined;
  }, [config.formConfig, desc, formEle, isYamlMode]);

  const handleStepChange = useCallback(
    async (nextStep: number) => {
      const isNextStep = nextStep > step;

      if (isNextStep && refineFormContainerRef.current?.validate) {
        // validate current step fields before moving to next
        const isValid = await refineFormContainerRef.current?.validate();

        if (!isValid) {
          return;
        }
        setStep(nextStep);
      } else {
        setStep(nextStep);
      }
    },
    [step]
  );

  return (
    <WizardDialog
      style={
        {
          '--max-modal-width': isYamlForm || !isDisabledChangeMode ? '1024px' : '648px',
        } as React.CSSProperties
      }
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
      error={errorText}
      steps={steps}
      step={step}
      onStepChange={handleStepChange}
      onOk={onOk}
      okButtonProps={{
        ...omit(saveButtonProps, 'onClick'),
        children: config.formConfig?.saveButtonText,
        size: 'middle',
      }}
      okText={okText}
      destroyOnClose
      destroyOtherStep
      {...modalProps}
    >
      {desc ? <div className={FormDescStyle}>{desc}</div> : undefined}
      {formEle}
    </WizardDialog>
  );
}

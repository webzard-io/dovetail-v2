import {
  usePopModal,
  usePushModal,
  LegacyModal,
  Typo,
  WizardDialog,
} from '@cloudtower/eagle';
import { WizardDialogProps } from '@cloudtower/eagle/dist/src/core/WizardDialog/type';
import { css } from '@linaria/core';
import { BaseRecord, CreateResponse, UpdateResponse } from '@refinedev/core';
import { omit } from 'lodash-es';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WarningButtonStyle } from 'src/styles/button';
import { SmallModalStyle } from 'src/styles/modal';
import { FormType, FormMode, RefineFormConfig, CommonFormConfig } from 'src/types';
import { ResourceConfig } from 'src/types';
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
    <LegacyModal
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
    </LegacyModal>
  );
}

export type FormModalProps = {
  id?: string;
  resourceConfig: Pick<
    ResourceConfig,
    | 'name'
    | 'displayName'
    | 'kind'
    | 'initValue'
    | 'apiVersion'
    | 'basePath'
    | 'formConfig'
  >;
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
    id,
    yamlFormProps: customYamlFormProps,
    modalProps,
    options,
    resourceConfig,
    onSuccess,
  } = props;
  const { i18n } = useTranslation();
  const [saveButtonProps, setSaveButtonProps] = useState<SaveButtonProps>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [mode, setMode] = useState<FormMode>(FormMode.FORM);
  const [step, setStep] = useState<number>(0);
  const isYamlMode = mode === FormMode.YAML;
  const refineFormContainerRef = useRef<RefineFormContainerRef>(null);
  const popModal = usePopModal();
  const pushModal = usePushModal();
  const isDisabledChangeMode =
    resourceConfig.formConfig &&
    'isDisabledChangeMode' in resourceConfig.formConfig &&
    resourceConfig.formConfig.isDisabledChangeMode;
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');
  const action = id ? 'edit' : 'create';

  const isYamlForm = resourceConfig.formConfig?.formType === FormType.YAML;

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
    if (typeof resourceConfig.formConfig?.formTitle === 'string')
      return resourceConfig.formConfig?.formTitle;

    if (typeof resourceConfig.formConfig?.formTitle === 'function') {
      return resourceConfig.formConfig?.formTitle(action);
    }
    const label = resourceConfig.displayName || resourceConfig?.kind;

    return i18n.t(id ? 'dovetail.edit_resource' : 'dovetail.create_resource', {
      resource: transformResourceKindInSentence(label, i18n.language),
    });
  }, [
    action,
    resourceConfig.formConfig,
    resourceConfig.displayName,
    resourceConfig?.kind,
    i18n,
    id,
  ]);
  const desc = useMemo(() => {
    if (typeof resourceConfig.formConfig?.formDesc === 'string')
      return resourceConfig.formConfig?.formDesc;

    if (typeof resourceConfig.formConfig?.formDesc === 'function') {
      return resourceConfig.formConfig?.formDesc(action);
    }
    return '';
  }, [action, resourceConfig.formConfig]);
  const formEle = useMemo(() => {
    const commonFormProps = {
      id: id as string,
      resourceConfig,
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
      resourceConfig.formConfig &&
      (resourceConfig.formConfig?.formType === FormType.FORM ||
        'fields' in resourceConfig.formConfig)
    ) {
      return (
        <RefineFormContainer
          {...commonFormProps}
          ref={refineFormContainerRef}
          step={step}
          options={options}
          isYamlMode={isYamlMode}
          formConfig={resourceConfig.formConfig as RefineFormConfig & CommonFormConfig}
        />
      );
    }

    return (
      <YamlFormContainer {...commonFormProps} formConfig={resourceConfig.formConfig} />
    );
  }, [
    id,
    customYamlFormProps,
    resourceConfig,
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

    if (resourceConfig.formConfig && 'steps' in resourceConfig.formConfig) {
      return resourceConfig.formConfig?.steps?.map((step, index) => ({
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
  }, [resourceConfig.formConfig, desc, formEle, isYamlMode]);

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
          {resourceConfig.formConfig?.formType === FormType.FORM ? (
            <FormModeSegmentControl
              formConfig={resourceConfig.formConfig}
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
        children: resourceConfig.formConfig?.saveButtonText,
      }}
      okText={resourceConfig.formConfig?.saveButtonText || okText}
      destroyOnClose
      destroyOtherStep
      {...modalProps}
    >
      {desc ? <div className={FormDescStyle}>{desc}</div> : undefined}
      {formEle}
    </WizardDialog>
  );
}

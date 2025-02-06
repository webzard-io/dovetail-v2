import { CloseCircleFilled } from '@ant-design/icons';
import { usePopModal, usePushModal, Modal, SegmentControl, Typo, Alert } from '@cloudtower/eagle';
import { ExclamationErrorCircleFill16RedIcon } from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { WarningButtonStyle } from 'src/styles/button';
import { FullscreenModalStyle } from 'src/styles/modal';
import { SmallModalStyle } from 'src/styles/modal';
import { transformResourceKindInSentence } from 'src/utils/string';
import { RefineFormContent } from './RefineFormContent';
import useFieldsConfig from './useFieldsConfig';
import { useRefineForm } from './useRefineForm';
import { YamlForm, YamlFormProps } from './YamlForm';

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
      <div className={Typo.Label.l2_regular}>
        {t('dovetail.exit_yaml_tip')}
      </div>
    </Modal>
  );
}

export type FormModalProps = {
  resource?: string;
  id?: string;
  formProps?: YamlFormProps;
  renderForm?: (props: YamlFormProps) => React.ReactNode;
};

enum Mode {
  Form = 'form',
  Yaml = 'yaml'
}

export function FormModal(props: FormModalProps) {
  const { resource: resourceFromProps, id, renderForm } = props;
  const { i18n } = useTranslation();
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);
  const [yamlSaveButtonProps, setYamlSaveButtonProps] = useState<{
    loading?: boolean | { delay?: number | undefined };
    onClick?: () => void;
  }>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>(Mode.Form);
  const isYamlMode = mode === Mode.Yaml;
  const popModal = usePopModal();
  const pushModal = usePushModal();
  const config = configs[resourceFromProps || resource?.name || ''];
  const isDisabledChangeMode = config.formConfig?.isDisabledChangeMode;
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');
  const action = id ? 'edit' : 'create';
  const fieldsConfig = useFieldsConfig(config, id);
  const refineFormResult = useRefineForm({
    config,
    id,
    refineProps: {
      onMutationSuccess: () => {
        popModal();
      },
      redirect: false,
      ...config.formConfig?.refineCoreProps,
    },
  });
  const yamlFormProps: YamlFormProps = useMemo(
    () => {
      const transformApplyValues = config.formConfig?.transformApplyValues || ((v: Record<string, unknown>) => v as Unstructured);

      return {
        ...props.formProps,
        transformInitValues: isYamlMode ? undefined : config.formConfig?.transformInitValues,
        transformApplyValues: isYamlMode ? undefined : transformApplyValues,
        initialValuesForCreate: isYamlMode ?
          transformApplyValues(refineFormResult.formResult.getValues()) :
          (props.formProps?.initialValuesForCreate || config?.initValue),
        initialValuesForEdit: isYamlMode ?
          transformApplyValues(refineFormResult.formResult.getValues()) : undefined,
        id,
        action,
        isShowLayout: false,
        useFormProps: {
          redirect: false,
        },
        rules: isYamlMode ? fieldsConfig?.map((config) => ({
          path: config.path,
          validators: config.validators,
        })) : undefined,
        onSaveButtonPropsChange: setYamlSaveButtonProps,
        onErrorsChange(errors) {
          setIsError(!!errors.length);
        },
        onFinish: popModal,
      };
    },
    [
      props.formProps,
      config.formConfig?.transformInitValues,
      config.formConfig?.transformApplyValues,
      config?.initValue,
      id,
      action,
      refineFormResult.formResult,
      isYamlMode,
      fieldsConfig,
      popModal,
    ]
  );

  const isYamlForm = !config.formConfig?.fields;

  const formEle = (() => {
    if (renderForm) {
      return renderForm(yamlFormProps);
    }

    if (isYamlForm || isYamlMode) return <YamlForm {...yamlFormProps} />;

    return (
      <RefineFormContent
        formResult={refineFormResult.formResult}
        config={config}
        errorMsgs={refineFormResult.responseErrorMsgs}
        resourceId={id as string}
      />
    );
  })();

  const saveButtonProps = isYamlForm || isYamlMode
    ? yamlSaveButtonProps
    : refineFormResult.formResult.saveButtonProps;

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
  const onChangeMode = useCallback((value: Mode) => {
    if (value === Mode.Form) {
      pushModal<'ConfirmModal'>({
        component: ConfirmModal,
        props: {
          onOk: () => {
            setMode(Mode.Form);
          },
        },
      });
    } else {
      setMode(value);
    }
  }, [pushModal]);

  const errorText = (() => {
    if (!!refineFormResult.responseErrorMsgs.length || isError) {
      return i18n.t(id ? 'dovetail.save_failed' : 'dovetail.create_failed');
    }
  })();

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

  return (
    <Modal
      className={cx(
        FullscreenModalStyle,
      )}
      style={{ '--max-modal-width': isYamlForm || !isDisabledChangeMode ? '1024px' : '648px' } as React.CSSProperties}
      width="calc(100vw - 16px)"
      title={(
        <div className={TitleWrapperStyle}>
          <span>{title}</span>
          {
            !(isYamlForm || isDisabledChangeMode) ? (
              <SegmentControl
                style={{ fontWeight: 'normal' }}
                value={mode}
                options={[{
                  value: Mode.Form,
                  label: i18n.t('dovetail.form')
                }, {
                  value: Mode.Yaml,
                  label: i18n.t('dovetail.yaml')
                }]}
                onChange={(val) => {
                  onChangeMode(val as Mode);
                }}
              />
            ) : null
          }
        </div>
      )}
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
      {!isYamlForm && mode === Mode.Form && !isDisabledChangeMode ?
        (<Alert
          type="warning"
          message={i18n.t('dovetail.change_form_mode_alert')}
          style={{ marginBottom: '16px' }}
        />) :
        undefined}
      {formEle}
    </Modal>
  );
}

import { CloseCircleFilled } from '@ant-design/icons';
import { usePopModal, Modal } from '@cloudtower/eagle';
import { ExclamationErrorCircleFill16RedIcon } from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { RefineFormContent } from './RefineFormContent';
import { useRefineForm } from './useRefineForm';
import { YamlForm, YamlFormProps } from './YamlForm';

const FormDescStyle = css`
  margin-bottom: 16px;
`;

export const FullscreenModalStyle = css`
  &.ant-modal.fullscreen {
    .ant-modal-header {
      padding: 60px 128px 32px 128px;
    }

    .ant-modal-body {
      padding: 0 128px;
    }

    .ant-modal-footer {
      .footer-content {
        margin: 0 128px;
      }
    }
  }
`;
const MaxWidthModalStyle = css`
  .ant-modal-header {
    max-width: 648px;
    width: 100%;
    padding: 60px 0 32px 0 !important;
    margin: auto;
  }

  .ant-modal-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 4px !important;
    margin: auto;
  }

  .ant-modal-footer {
    .footer-content {
      max-width: 648px;
      width: 100%;
      margin: auto !important;
    }
  }

  .${FormDescStyle} {
    max-width: 648px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const ErrorStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export type FormModalProps = {
  resource?: string;
  id?: string;
  formProps?: YamlFormProps;
  renderForm?: (props: YamlFormProps) => React.ReactNode;
};

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
  const popModal = usePopModal();

  const config = configs[resourceFromProps || resource?.name || ''];
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');
  const action = id ? 'edit' : 'create';
  const yamlFormProps: YamlFormProps = useMemo(
    () => ({
      ...props.formProps,
      transformInitValues: config.formConfig?.transformInitValues,
      transformApplyValues: config.formConfig?.transformApplyValues,
      initialValues: props.formProps?.initialValues || config?.initValue,
      id,
      action,
      isShowLayout: false,
      useFormProps: {
        redirect: false,
      },
      onSaveButtonPropsChange: setYamlSaveButtonProps,
      onErrorsChange(errors) {
        setIsError(!!errors.length);
      },
      onFinish: popModal,
    }),
    [
      props.formProps,
      config.formConfig?.transformInitValues,
      config.formConfig?.transformApplyValues,
      config?.initValue,
      id,
      action,
      popModal,
    ]
  );

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

  const isYamlForm = !config.formConfig?.fields;

  const formEle = (() => {
    if (renderForm) {
      return renderForm(yamlFormProps);
    }

    if (isYamlForm) return <YamlForm {...yamlFormProps} />;

    return (
      <RefineFormContent
        formResult={refineFormResult.formResult}
        config={config}
        errorMsg={refineFormResult.responseErrorMsg}
        resourceId={id as string}
      />
    );
  })();

  const saveButtonProps = isYamlForm
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

  const errorText = (() => {
    if (!!refineFormResult.responseErrorMsg || isError) {
      return i18n.t(id ? 'dovetail.save_failed' : 'dovetail.create_failed');
    }
  })();

  const title = useMemo(() => {
    if (typeof config.formConfig?.formTitle === 'string')
      return config.formConfig?.formTitle;

    if (typeof config.formConfig?.formTitle === 'function') {
      return config.formConfig?.formTitle(action);
    }
    return i18n.t(id ? 'dovetail.edit_resource' : 'dovetail.create_resource', {
      resource: config?.kind,
    });
  }, [action, config.formConfig, config?.kind, i18n, id]);

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
      className={cx(FullscreenModalStyle, isYamlForm ? '' : MaxWidthModalStyle)}
      width="calc(100vw - 16px)"
      title={title}
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

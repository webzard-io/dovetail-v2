import { CloseCircleFilled } from '@ant-design/icons';
import { popModal, Modal } from '@cloudtower/eagle';
import { ExclamationErrorCircleFill16RedIcon } from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import { useResource } from '@refinedev/core';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { RefineFormContent } from './RefineFormContent';
import { useRefineForm } from './useRefineForm';
import { YamlForm, YamlFormProps } from './YamlForm';

const FullscreenModalStyle = css`
  &.ant-modal.fullscreen {
    .ant-modal-header {
      padding: 60px 128px 32px 128px;
    }

    .ant-modal-body {
      padding: 0 128px;
    }

    .ant-modal-footer {
      padding: 15px 128px;
    }
  }
`;
const FormDescStyle = css`
  margin-bottom: 16px;
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
    loading?: boolean;
    onClick?: () => void;
  }>({});
  const [isError, setIsError] = useState<boolean>(false);

  const config = configs[resourceFromProps || resource?.name || ''];
  const title = i18n.t(id ? 'dovetail.edit_resource' : 'dovetail.create_resource', {
    resource: config?.kind,
  });
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');

  const yamlFormProps: YamlFormProps = useMemo(
    () => ({
      ...props.formProps,
      transformInitValues: config.formConfig?.transformInitValues,
      transformApplyValues: config.formConfig?.transformApplyValues,
      initialValues: props.formProps?.initialValues || config?.initValue,
      id,
      action: id ? 'edit' : 'create',
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
    [props.formProps, setYamlSaveButtonProps, config, id]
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
        action={id ? 'edit' : 'create'}
      />
    );
  })();

  const saveButtonProps = isYamlForm
    ? yamlSaveButtonProps
    : refineFormResult.formResult.saveButtonProps;

  const onCancel = useCallback(() => {
    popModal();
  }, []);

  const onOk = useCallback(
    e => {
      saveButtonProps.onClick?.(e);
    },
    [saveButtonProps]
  );

  const errorText = (() => {
    if (!!refineFormResult.responseErrorMsg || isError) {
      return i18n.t(id ? 'dovetail.save_failed' : 'dovetail.create_failed');
    }
  })();

  return (
    <Modal
      className={FullscreenModalStyle}
      width="calc(100vw - 16px)"
      title={config.formConfig?.formTitle || title}
      error={
        errorText ? (
          <div className={ErrorStyle}>
            <ExclamationErrorCircleFill16RedIcon /> {errorText}
          </div>
        ) : (
          ''
        )
      }
      okButtonProps={saveButtonProps}
      closeIcon={<CloseCircleFilled />}
      okText={okText}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      fullscreen
    >
      {config.formConfig?.formDesc ? (
        <div className={FormDescStyle}>{config.formConfig?.formDesc}</div>
      ) : undefined}
      {formEle}
    </Modal>
  );
}

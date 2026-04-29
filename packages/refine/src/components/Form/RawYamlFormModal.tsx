import { usePopModal, ImmersiveDialog } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { BaseRecord, CreateResponse, UpdateResponse } from '@refinedev/core';
import { omit } from 'lodash-es';
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceConfig } from 'src/types';
import { transformResourceKindInSentence } from 'src/utils/string';
import { SaveButtonProps } from './FormModal';
import { YamlFormProps } from './YamlForm';
import YamlFormContainer, { YamlFormContainerProps } from './YamlFormContainer';

const FormDescStyle = css`
  margin-bottom: 16px;
  max-width: var(--max-modal-width, 1024px);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

type RawYamlFormModalProps = {
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
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
};

export function RawYamlFormModal(props: RawYamlFormModalProps) {
  const { id, yamlFormProps: customYamlFormProps, resourceConfig, onSuccess } = props;
  const { i18n } = useTranslation();
  const [saveButtonProps, setSaveButtonProps] = useState<SaveButtonProps>({});
  const [isError, setIsError] = useState<boolean>(false);
  const popModal = usePopModal();
  const okText = i18n.t(id ? 'dovetail.save' : 'dovetail.create');
  const action = id ? 'edit' : 'create';

  const onOk = useCallback(
    e => {
      setIsError(false);
      saveButtonProps.onClick?.(e);
    },
    [saveButtonProps]
  );

  const errorText = useMemo(() => {
    if (isError) {
      const customText = resourceConfig.formConfig?.formFailedText;
      if (customText) return customText;
      return i18n.t(id ? 'dovetail.save_failed' : 'dovetail.create_failed');
    }
    return '';
  }, [isError, id, i18n, resourceConfig.formConfig?.formFailedText]);

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
    const commonFormProps: YamlFormContainerProps = {
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

    return <YamlFormContainer {...commonFormProps} />;
  }, [id, customYamlFormProps, resourceConfig, popModal, setSaveButtonProps, onSuccess]);

  return (
    <ImmersiveDialog
      title={title}
      error={errorText}
      onOk={onOk}
      okButtonProps={{
        ...omit(saveButtonProps, 'onClick'),
        children: resourceConfig.formConfig?.saveButtonText,
      }}
      okText={resourceConfig.formConfig?.saveButtonText || okText}
      destroyOnClose
    >
      {desc ? <div className={FormDescStyle}>{desc}</div> : undefined}
      {formEle}
    </ImmersiveDialog>
  );
}

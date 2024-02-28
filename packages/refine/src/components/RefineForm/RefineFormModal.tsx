import { CloseCircleFilled } from '@ant-design/icons';
import { popModal, Modal } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useForm } from '@refinedev/react-hook-form';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { ResourceConfig } from '../../types';
import { RefineFormContent } from './RefineFormContent';

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

export type RefineFormModalProps = {
  config: ResourceConfig;
  id?: string;
};

export function RefineFormModal<Model extends ResourceModel>(
  props: RefineFormModalProps
) {
  const { config, id } = props;
  const { i18n } = useTranslation();
  const {
    refineCore: { onFinish },
    getValues,
    saveButtonProps,
    control,
  } = useForm<Model>({
    refineCoreProps: {
      resource: config.name,
      action: id ? 'edit' : 'create',
      id,
      onMutationSuccess: () => {
        popModal();
      },
    },
    defaultValues: config?.initValue,
  });

  const title = useMemo(
    () =>
      i18n.t(id ? 'dovetail.edit_resource' : 'dovetail.create_resource', {
        resource: config?.kind,
      }),
    [id, i18n, config]
  );

  const onCancel = useCallback(() => {
    popModal();
  }, []);

  const onOk = useCallback(() => {
    const data = getValues();
    console.log(getValues());
    onFinish(data).then(res => {
      console.log('res', res);
      popModal();
    });
  }, [getValues, onFinish]);

  return (
    <Modal
      className={FullscreenModalStyle}
      width="calc(100vw - 16px)"
      title={title}
      okButtonProps={saveButtonProps}
      closeIcon={<CloseCircleFilled />}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      fullscreen
    >
      <RefineFormContent config={config} control={control} />;
    </Modal>
  );
}

export default RefineFormModal;

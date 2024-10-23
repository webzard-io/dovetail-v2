import { Fields, Form, Units } from '@cloudtower/eagle';
import { useResource, useUpdate } from '@refinedev/core';
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditField } from 'src/components/EditField';
import { PersistentVolumeClaimModel } from 'src/models';
import { pruneBeforeEdit } from 'src/utils/k8s';
import { transformStorageUnit, StorageUnit } from 'src/utils/storage';
import { parseSi } from 'src/utils/unit';

interface DistributeStorageFormHandler {
  submit: () => Promise<unknown> | boolean | undefined;
}

interface DistributeStorageFormProps {
  pvc: PersistentVolumeClaimModel;
  defaultValue: number;
}

export const DistributeStorageForm = React.forwardRef<DistributeStorageFormHandler, DistributeStorageFormProps>(function DistributeStorageForm(props, ref) {
  const { defaultValue, pvc } = props;
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();

  const [distributeStorage, setDistributeStorage] = useState(defaultValue);
  const [validateResult, setValidateResult] = useState<{
    distributeStorage: string;
  }>({
    distributeStorage: ''
  });

  const validators = useMemo(() => {
    return {
      distributeStorage(value: number) {
        if (!value) {
          return t('dovetail.pvc_storage_required');
        } else if (value < defaultValue) {
          return t('dovetail.pvc_storage_reduce_limit');
        }

        return '';
      }
    };
  }, [t, defaultValue]);

  const submit = useCallback(() => {
    const isInvalid = !!validators.distributeStorage(distributeStorage);

    if (isInvalid) {
      return false;
    }

    const v = pvc.updateDistributeStorage(distributeStorage);
    const id = pvc.id;

    pruneBeforeEdit(v);

    return mutateAsync({
      id,
      resource: resource?.name || '',
      values: v,
      successNotification() {
        return {
          message: t('dovetail.edit_distribute_storage_success_toast', {
            kind: pvc.kind,
            name: pvc.id,
            interpolation: {
              escapeValue: false
            }
          }),
          type: 'success'
        };
      },
      errorNotification: false,
    });
  }, [pvc, distributeStorage, resource?.name, validators, mutateAsync, t]);

  useImperativeHandle(ref, () => ({
    submit,
  }), [submit]);

  return (
    <Form.Item
      label={<span style={{ width: '134px' }}>{t('dovetail.distributed')}</span>}
      colon={false}
      help={validateResult.distributeStorage}
      validateStatus={validateResult.distributeStorage ? 'error' : ''}
    >
      <Fields.Integer
        style={{ width: '142px' }}
        input={{
          name: 'distributeStorage',
          value: distributeStorage,
          onChange: (value) => {
            const v = Number(value);

            setDistributeStorage(v);
            setValidateResult({
              distributeStorage: validators.distributeStorage(v)
            });
          },
          onBlur: () => undefined,
          onFocus: () => undefined,
        }}
        min={1}
        meta={{}}
        suffix="GiB"
        controls
      />
    </Form.Item>
  );
});

interface PVCDistributeStorageProps {
  pvc: PersistentVolumeClaimModel;
  editable: boolean;
}

function PVCDistributeStorage({ pvc, editable }: PVCDistributeStorageProps) {
  const { t } = useTranslation();
  const formRef = useRef<DistributeStorageFormHandler>(null);

  const value = pvc.spec.resources?.requests?.storage;

  return (
    <div>
      <Units.Byte rawValue={parseSi(value as string)} decimals={1} />
      {
        editable && (
          <EditField
            modalProps={{
              formRef,
              title: t('dovetail.edit_replicas'),
              renderContent() {
                return (
                  <DistributeStorageForm
                    ref={formRef}
                    defaultValue={value ? transformStorageUnit(value, StorageUnit.Gi) : 0}
                    pvc={pvc}
                  />
                );
              }
            }}
          />
        )
      }
    </div>
  );
}

export default PVCDistributeStorage;

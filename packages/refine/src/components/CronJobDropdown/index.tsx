import { Icon, useUIKit } from '@cloudtower/eagle';
import {
  Pause16GradientBlueIcon,
  RecoverContinue16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { useResource, useUpdate, useCan } from '@refinedev/core';
import { CronJob } from 'kubernetes-types/batch/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccessControlAuth } from 'src/constants/auth';
import { CronJobModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import K8sDropdown, { DropdownSize } from '../K8sDropdown';

type Props<Model extends CronJobModel> = {
  record: Model;
  size?: DropdownSize;
};

export function CronJobDropdown<Model extends CronJobModel>(props: Props<Model>) {
  const { record, size } = props;
  const { spec } = record as CronJob;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();
  const { data: canEditData } = useCan({
    resource: resource?.name,
    action: AccessControlAuth.Edit
  });

  const suspended = Boolean(spec?.suspend);

  return (
    <K8sDropdown record={record} size={size}>
      {
        canEditData?.can !== false ? (
          <kit.menu.Item
            onClick={async () => {
              const v = suspended ? record.resume() : record.suspend();
              const id = record.id;

              pruneBeforeEdit(v);
              await mutateAsync({
                id,
                resource: resource?.name || '',
                values: v,
                successNotification() {
                  return {
                    message: t(suspended ? 'dovetail.resume_success_toast' : 'dovetail.pause_success_toast', {
                      kind: record.kind,
                      name: id,
                      interpolation: {
                        escapeValue: false,
                      }
                    }),
                    type: 'success',
                  };
                },
                errorNotification() {
                  return {
                    message: t(suspended ? 'dovetail.resume_failed_toast' : 'dovetail.pause_failed_toast', {
                      kind: record.kind,
                      name: id,
                      interpolation: {
                        escapeValue: false,
                      }
                    }),
                    type: 'error'
                  };
                }
              });
            }}
          >
            <Icon src={suspended ? RecoverContinue16GradientBlueIcon : Pause16GradientBlueIcon}>
              {t(suspended ? 'dovetail.resume' : 'dovetail.suspend')}
            </Icon>
          </kit.menu.Item>
        ) : null
      }
    </K8sDropdown >
  );
}

import { usePopModal, Loading, ImmersiveDialog } from '@cloudtower/eagle';
import React, { lazy, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { SocketStatus } from 'src/components/Shell/common';
import { useGlobalStore } from 'src/hooks';
import { PodModel } from 'src/models';

const PodShell = lazy(() =>
  import('./PodShell').then(module => ({ default: module.PodShell }))
);

interface PodShellModalProps {
  pod: PodModel;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}

export function PodShellModal(props: PodShellModalProps) {
  const { pod } = props;
  const { t } = useTranslation();
  const popModal = usePopModal();
  const globalStore = useGlobalStore();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(SocketStatus.Opening);

  return (
    <ImmersiveDialog
      title={t('dovetail.exec_pod')}
      onCancel={() => {
        popModal();
      }}
      error={
        socketStatus === SocketStatus.Disconnected ? (
          socketStatus
        ) : (
          <span style={{ color: 'green' }}>{socketStatus}</span>
        )
      }
      keyboard
      destroyOnClose
      visible
    >
      <Suspense fallback={<Loading />}>
        <PodShell
          pod={pod}
          onSocketStatusChange={setSocketStatus}
          basePath={globalStore?.apiUrl || ''}
        />
      </Suspense>
    </ImmersiveDialog>
  );
}

export { PodShell };

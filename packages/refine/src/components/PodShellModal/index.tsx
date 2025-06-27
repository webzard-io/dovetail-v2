import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, usePopModal, Loading } from '@cloudtower/eagle';
import React, { lazy, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { SocketStatus } from 'src/components/Shell/common';
import { useGlobalStore } from 'src/hooks';
import { PodModel } from 'src/models';
import { FullscreenModalStyle } from 'src/styles/modal';

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
    <Modal
      className={FullscreenModalStyle}
      width="calc(100vw - 16px)"
      title={t('dovetail.exec_pod')}
      closeIcon={<CloseCircleFilled />}
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
      fullscreen
      visible
    >
      <Suspense fallback={<Loading />}>
        <PodShell
          pod={pod}
          onSocketStatusChange={setSocketStatus}
          basePath={globalStore?.apiUrl || ''}
        />
      </Suspense>
    </Modal>
  );
}

export { PodShell };

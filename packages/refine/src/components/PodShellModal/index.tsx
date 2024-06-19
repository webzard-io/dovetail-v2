import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, usePopModal } from '@cloudtower/eagle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FullscreenModalStyle } from 'src/components/Form/FormModal';
import { PodShell, SocketStatus } from './PodShell';

interface PodShellModalProps {
  id: string;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}

export function PodShellModal(props: PodShellModalProps) {
  const { id } = props;
  const { t } = useTranslation();
  const popModal = usePopModal();
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
      error={socketStatus === SocketStatus.Disconnected ? socketStatus : <span style={{ color: 'green' }}>{socketStatus}</span>}
      keyboard
      destroyOnClose
      fullscreen
      visible
    >
      <PodShell id={id} onSocketStatusChange={setSocketStatus} />
    </Modal>
  );
}

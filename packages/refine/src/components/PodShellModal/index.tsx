import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, usePopModal } from '@cloudtower/eagle';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FullscreenModalStyle } from 'src/components/Form/FormModal';
import { SocketStatus } from 'src/components/Shell';
import GlobalStoreContext from 'src/contexts/global-store';
import { PodModel } from 'src/models';
import { PodShell } from './PodShell';

interface PodShellModalProps {
  pod: PodModel;
  onSocketStatusChange?: (socketStatus: SocketStatus) => void;
}

export function PodShellModal(props: PodShellModalProps) {
  const { pod } = props;
  const { t } = useTranslation();
  const popModal = usePopModal();
  const { globalStore } = useContext(GlobalStoreContext);
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
      <PodShell
        pod={pod}
        onSocketStatusChange={setSocketStatus}
        basePath={globalStore?.apiUrl || ''}
      />
    </Modal>
  );
}

export { PodShell };

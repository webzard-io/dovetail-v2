import { ModalType } from '@cloudtower/eagle';
import { EditFieldModalProps } from 'src/components/EditField';
import { FormModalProps, ConfirmModalProps } from 'src/components/FormModal';
import { PodShellModal } from 'src/components/PodShellModal';

type ModalProps = {
  FormModal: FormModalProps;
  ConfirmModal: ConfirmModalProps;
  EditFieldModal: EditFieldModalProps;
  PodShellModal: PodShellModal;
};

declare module '@cloudtower/eagle' {
  interface IModalProps extends ModalProps { }

  export declare function pushModal<K extends keyof ModalProps>(
    modal: ModalType<ModalProps[K]>
  ): void;
}

import { DeleteDialogProps, ModalType } from '@cloudtower/eagle';
import { EditFieldModalProps } from 'src/components/EditField';
import { FormModalProps, ConfirmModalProps } from 'src/components/FormModal';
import { PodShellModal } from 'src/components/PodShellModal';

type ModalProps = {
  FormModal: FormModalProps;
  ConfirmModal: ConfirmModalProps;
  EditFieldModal: EditFieldModalProps;
  PodShellModal: PodShellModal;
  DeleteDialog: DeleteDialogProps;
  RejectDialog: RejectDialogProps;
};

declare module '@cloudtower/eagle' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IModalProps extends ModalProps { }

  export declare function pushModal<K extends keyof ModalProps>(
    modal: ModalType<ModalProps[K]>
  ): void;
}

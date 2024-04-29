import { ModalType } from '@cloudtower/eagle';
import { EditFieldModalProps } from 'src/components/EditField';
import { FormModalProps } from 'src/components/FormModal';

type ModalProps = {
  FormModal: FormModalProps;
  EditFieldModal: EditFieldModalProps;
};

declare module '@cloudtower/eagle' {
  interface IModalProps extends ModalProps {}

  export declare function pushModal<K extends keyof ModalProps>(
    modal: ModalType<ModalProps[K]>
  ): void;
}

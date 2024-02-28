import { ModalType } from '@cloudtower/eagle';
import { EditFieldModalProps } from 'src/components/EditField';
import { FormModalProps } from 'src/components/FormModal';
import { RefineFormModalProps } from 'src/components/RefineForm';

type ModalProps = {
  FormModal: FormModalProps;
  EditFieldModal: EditFieldModalProps;
  RefineFormModal: RefineFormModalProps;
};

declare module '@cloudtower/eagle' {
  export declare function pushModal<K extends keyof ModalProps>(
    modal: ModalType<ModalProps[K]>
  ): void;
}

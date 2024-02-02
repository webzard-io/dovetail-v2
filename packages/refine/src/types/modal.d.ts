import { ModalType } from '@cloudtower/eagle';
import { FormModalProps } from 'src/components/FormModal';

type ModalProps = {
  FormModal: FormModalProps;
};

declare module '@cloudtower/eagle' {
  export declare function pushModal<K extends keyof ModalProps>(
    modal: ModalType<ModalProps[K]>
  ): void;
}

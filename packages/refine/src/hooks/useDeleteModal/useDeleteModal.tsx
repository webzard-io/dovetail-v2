import { DeleteDialogProps } from '@cloudtower/eagle';
import { HttpError } from '@refinedev/core';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { getCommonErrors } from 'src/utils/error';
import { useDeleteModalOnly } from './useDeleteModalOnly';
import { useFailedModal } from './useFailedModal';

type useDeleteDialogProps = {
  resourceName: string;
  deleteDialogProps?: Partial<DeleteDialogProps>;
};

/**
 * 打开确认删除弹窗，如果失败会自动弹出回绝弹窗
 */
export const useDeleteModal = ({
  resourceName,
  deleteDialogProps,
}: useDeleteDialogProps) => {
  const { i18n } = useTranslation();
  const configs = useContext(ConfigsContext);
  const config = configs[resourceName];

  const { openFailedModal } = useFailedModal(resourceName);

  const { openDeleteConfirmModal, closeDeleteConfirmModal } = useDeleteModalOnly({
    resource: resourceName,
    deleteDialogProps: { secondaryDesc: config.deleteTip, ...deleteDialogProps },
    onError: async (id, error: HttpError | undefined) => {
      closeDeleteConfirmModal();
      openFailedModal(id, getCommonErrors(await error?.response.json(), i18n));
    },
  });
  return { openDeleteConfirmModal, closeDeleteConfirmModal };
};

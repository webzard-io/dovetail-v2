import { ModalProps, Typo, Tag } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { first } from 'lodash-es';
import React, { useState, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ConfigsContext from 'src/contexts/configs';
import { CloseButtonStyle } from 'src/styles/button';
import { SmallModalStyle } from 'src/styles/modal';
import { NameTagStyle } from 'src/styles/tag';
import { transformResourceKindInSentence } from 'src/utils/string';

const TextStyle = css`
  margin-bottom: 4px;
`;
const TipStyle = css`
  color: rgba(44, 56, 82, 0.6);
`;

export const useFailedModal = (resource: string) => {
  const configs = useContext(ConfigsContext);
  const config = configs[resource];
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<string>('');
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const displayName = config.displayName || config.kind;
  const resourceDisplayName = transformResourceKindInSentence(displayName, i18n.language);

  const modalProps: ModalProps = {
    className: SmallModalStyle,
    title: t('dovetail.cant_delete_resource', {
      resource: resourceDisplayName,
    }),
    showOk: false,
    cancelButtonProps: {
      className: CloseButtonStyle,
    },
    cancelText: t('dovetail.close'),
    children: (
      <>
        <div className={cx(Typo.Label.l2_regular, TextStyle)}>
          <Trans
            i18nKey="dovetail.cant_delete_resource_with_name"
            tOptions={{
              name: id,
              resource: resourceDisplayName,
            }}
            shouldUnescape={true}
          >
            <Tag color="gray" className={NameTagStyle}></Tag>
          </Trans>
        </div>
        <div className={cx(Typo.Label.l4_regular, TipStyle)}>
          {errorMsgs.length > 1 ? (
            <ol>
              {errorMsgs.map((errorMsg, index) => (
                <li key={errorMsg}>
                  {index + 1 + '. '} {errorMsg}
                </li>
              ))}
            </ol>
          ) : (
            first(errorMsgs)
          )}
        </div>
      </>
    ),
    onCancel() {
      setVisible(false);
    },
  };

  function openFailedModal(id: string, errorMsgs: string[]) {
    setId(id);
    setErrorMsgs(errorMsgs);
    setVisible(true);
  }

  return { modalProps, visible, openFailedModal };
};

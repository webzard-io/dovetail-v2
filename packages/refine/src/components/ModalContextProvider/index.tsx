/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState, useCallback } from 'react';

interface ModalInfo {
  resource: string;
  id?: string;
}

type ModalContextValue = ModalInfo & {
  open: (info: ModalInfo) => void;
  close: () => void;
}

const MODAL_CONTEXT_DEFAULT_VALUE = {
  resource: '',
  id: ''
};

export const ModalContext = createContext<ModalContextValue>({
  ...MODAL_CONTEXT_DEFAULT_VALUE,
  open() { },
  close() { },
});

function ModalContextProvider(props: React.PropsWithChildren<Record<string, unknown>>) {
  const { children } = props;
  const [modalInfo, setModalInfo] = useState<ModalInfo>(MODAL_CONTEXT_DEFAULT_VALUE);

  const open = useCallback((info: ModalInfo) => {
    setModalInfo(info);
  }, []);
  const close = useCallback(() => {
    setModalInfo(MODAL_CONTEXT_DEFAULT_VALUE);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        ...modalInfo,
        open,
        close
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContextProvider;

import { BaseKey, useGo, useParsed } from '@refinedev/core';
import { useCallback } from 'react';

export function useEdit() {
  const { resource } = useParsed();
  const go = useGo();
  const edit = useCallback(
    (id: BaseKey) => {
      go({
        to: `${resource?.name}/edit`,
        query: {
          id,
        },
      });
    },
    [go, resource?.name]
  );
  return { edit };
}

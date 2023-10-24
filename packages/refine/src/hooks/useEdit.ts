import { BaseKey, useGo, useNavigation, useParsed } from '@refinedev/core';
import { useCallback } from 'react';

export function useEdit() {
  const { resource } = useParsed();
  const go = useGo();
  const navigation = useNavigation();
  const edit = useCallback(
    (id: BaseKey) => {
      go({
        to: navigation.editUrl(resource?.name || '', id),
        query: {
          id,
        },
        options: {
          keepQuery: true,
        },
      });
    },
    [go, resource?.name]
  );
  return { edit };
}

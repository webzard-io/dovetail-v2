import { BaseRecord } from '@refinedev/core';
import { QueryObserverResult } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface UseResourceVersionCheckParams {
  queryResult?: QueryObserverResult<{ data: BaseRecord }>;
}

export const useResourceVersionCheck = ({
  queryResult,
}: UseResourceVersionCheckParams): boolean => {
  const initialResourceVersionRef = useRef<string>();
  const [isExpired, setIsExpired] = useState(false);

  const currentResourceVersion =
    (queryResult?.data?.data as BaseRecord)?.metadata?.resourceVersion;

  useEffect(() => {
    if (!currentResourceVersion) return;

    if (!initialResourceVersionRef.current) {
      initialResourceVersionRef.current = currentResourceVersion;
      return;
    }

    if (currentResourceVersion !== initialResourceVersionRef.current) {
      setIsExpired(true);
    }
  }, [currentResourceVersion]);

  return isExpired;
};

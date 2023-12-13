import { useList } from '@refinedev/core';
import { Pod } from 'kubernetes-types/core/v1';
import { LabelSelector } from 'kubernetes-types/meta/v1';
import { useMemo } from 'react';
import { matchSelector } from 'src/utils/selector';
import { PodModel } from '../model';
import { WithId } from '../types';

export const usePods = (selector?: LabelSelector) => {
  const { data, isLoading } = useList({
    resource: 'pods',
    meta: { resourceBasePath: '/api/v1', kind: 'Pod' },
  });

  const pods = useMemo(() => {
    return data?.data
      .map(p => new PodModel(p as WithId<Pod>))
      .filter(p => {
        return selector ? matchSelector(p, selector) : true;
      });
  }, [data?.data, selector]);

  return { pods, isLoading };
};

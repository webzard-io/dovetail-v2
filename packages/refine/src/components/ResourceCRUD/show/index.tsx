import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react';
import { FormType } from 'src/types';
import { ResourceModel } from '../../../models';
import { PageShow } from '../../PageShow';
import { ShowField } from '../../ShowContent';

type Props<Model extends ResourceModel> = IResourceComponentsProps & {
  formatter?: (v: Model) => Model;
  filedGroups: ShowField<Model>[][];
  Dropdown?: React.FC<{ record: Model }>;
  formType?: FormType;
};

export function ResourceShow<Model extends ResourceModel>(props: Props<Model>) {
  const { formatter, filedGroups, Dropdown } = props;

  return (
    <PageShow<Model>
      fieldGroups={filedGroups}
      formatter={formatter}
      Dropdown={Dropdown}
      formType={FormType.MODAL}
    />
  );
}

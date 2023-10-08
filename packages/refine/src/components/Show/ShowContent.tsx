import { Typo, useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed, useResource, useShow } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { get } from 'lodash-es';
import React from 'react';
import K8sDropdown from 'src/components/K8sDropdown';
import { FirstLineFields, SecondLineFields, ShowField } from './Fields';

const TopBarStyle = css`
  justify-content: space-between;
  width: 100%;
`;

const ShowContentStyle = css`
  overflow: auto;
`;

type Props = {
  fieldGroups: ShowField[][];
};

export const ShowContent: React.FC<Props> = props => {
  const { fieldGroups } = props;
  const kit = useUIKit();
  const parsed = useParsed();
  const { resource } = useResource();
  const { queryResult } = useShow<Unstructured & { id: string }>({ id: parsed?.params?.id });
  const { data } = queryResult;
  const record = data?.data;

  if (!record) return null;

  function renderFields(fields: ShowField[]) {
    if (!record) return null;
    return fields.map(field => {
      let content = <span>{get(record, field.path)}</span>;
      if (field.render) {
        content = field.render(get(record, field.path), record);
      }
      return (
        <kit.space key={field.path.join()}>
          <span className={Typo.Label.l3_regular}>{field.title}: </span>
          {content}
        </kit.space>
      );
    });
  }

  const topBar = (
    <kit.space className={TopBarStyle}>
      <div>
        <span className={Typo.Display.d3_bold_title}>{resource?.meta?.kind}: </span>
        <span className={Typo.Label.l1_regular}>{record?.metadata.name}</span>
        <kit.tag color="green">Active</kit.tag>
      </div>
      <kit.space>
        <K8sDropdown data={record} />
      </kit.space>
    </kit.space>
  );

  const firstLine = (
    <kit.space size={8}>
      {renderFields([...FirstLineFields, ...fieldGroups[0]])}
    </kit.space>
  );
  const secondLine = <kit.space size={8}>{renderFields(fieldGroups[1])}</kit.space>;
  const labelAnnotations = (
    <kit.space direction="vertical">{renderFields(SecondLineFields)}</kit.space>
  );
  const thirdLine = (
    <kit.tabs>
      {fieldGroups[2].map(field => {
        let content = <span>{get(record, field.path)}</span>;
        if (field.render) {
          content = field.render(get(record, field.path), record);
        }
        return (
          <kit.tabsTabPane tab={field.title} key={field.key}>
            {content}
          </kit.tabsTabPane>
        );
      })}
    </kit.tabs>
  );

  return (
    <kit.space direction="vertical" className={ShowContentStyle}>
      {topBar}
      {firstLine}
      <kit.divider />
      {secondLine}
      {labelAnnotations}
      <kit.divider />
      {thirdLine}
    </kit.space>
  );
};

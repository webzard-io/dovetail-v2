import { Typo, useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed, useResource, useShow } from '@refinedev/core';
import yaml from 'js-yaml';
import { Unstructured } from 'k8s-api-provider';
import { get } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/K8sDropdown';
import MonacoYamlEditor from 'src/components/YamlEditor/MonacoYamlEditor';
import { ShowField } from './fields';
import { Tags } from '../Tags';

const TopBarStyle = css`
  justify-content: space-between;
  width: 100%;
`;

const ShowContentStyle = css`
  width: 100%;
  overflow: auto;
  height: 100%;
  width: 100%;
`;

const EditorStyle = css`
  margin-top: 16px;
`;

type Props = {
  fieldGroups: ShowField[][];
};

enum Mode {
  Detail = 'detail',
  Yaml = 'yaml',
}

export const ShowContent: React.FC<Props> = props => {
  const { fieldGroups } = props;
  const kit = useUIKit();
  const parsed = useParsed();
  const { resource } = useResource();
  const { queryResult } = useShow<Unstructured & { id: string }>({
    id: parsed?.params?.id,
  });
  const [mode, setMode] = useState<Mode>(Mode.Detail);
  const { t } = useTranslation();
  const { data } = queryResult;
  const record = data?.data;

  if (!record) return null;

  const FirstLineFields: ShowField[] = [
    {
      key: 'NameSpace',
      title: t('namespace'),
      path: ['metadata', 'namespace'],
    },
    {
      key: 'Age',
      title: t('created_time'),
      path: ['metadata', 'creationTimestamp'],
    },
  ];

  const SecondLineFields: ShowField[] = [
    {
      key: 'Labels',
      title: t('label'),
      path: ['metadata', 'labels'],
      render: value => {
        return <Tags value={value as Record<string, string>} />;
      },
    },
    {
      key: 'Annotations',
      title: t('annotation'),
      path: ['metadata', 'annotations'],
      render: value => {
        return <Tags value={value as Record<string, string>} />;
      },
    },
  ];

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
        <span className={Typo.Display.d2_bold_title}>{resource?.meta?.kind}: </span>
        <span className={Typo.Label.l1_regular}>{record?.metadata.name}</span>
        <kit.tag color="green">Active</kit.tag>
      </div>
      <kit.space>
        <kit.radioGroup value={mode} onChange={e => setMode(e.target.value)}>
          <kit.radioButton value="detail">{t('detail')}</kit.radioButton>
          <kit.radioButton value="yaml">YAML</kit.radioButton>
        </kit.radioGroup>
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
  const tabs = (
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
  const modeMap = {
    [Mode.Detail]: (
      <>
        {secondLine}
        {labelAnnotations}
        <kit.divider />
        {tabs}
      </>
    ),
    [Mode.Yaml]: (
      <MonacoYamlEditor
        className={EditorStyle}
        defaultValue={yaml.dump(record)}
        schema={{}}
        readOnly
      />
    ),
  };

  return (
    <kit.space direction="vertical" className={ShowContentStyle}>
      {topBar}
      {firstLine}
      <kit.divider />
      {modeMap[mode]}
    </kit.space>
  );
};

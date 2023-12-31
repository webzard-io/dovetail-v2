import { Typo, useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed, useResource, useShow } from '@refinedev/core';
import yaml from 'js-yaml';
import { get } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/K8sDropdown';
import MonacoYamlEditor from 'src/components/YamlEditor/MonacoYamlEditor';
import useK8sYamlEditor from 'src/hooks/useK8sYamlEditor';
import { useGlobalStore } from '../../hooks';
import { ResourceModel } from '../../models';
import { EventsTable } from '../EventsTable';
import { StateTag } from '../StateTag';
import { Tags } from '../Tags';
import Time from '../Time';
import { ShowField } from './fields';

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

type Props<Model extends ResourceModel> = {
  fieldGroups: ShowField<Model>[][];
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
};

enum Mode {
  Detail = 'detail',
  Yaml = 'yaml',
}

export const ShowContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { fieldGroups, formatter, Dropdown = K8sDropdown } = props;
  const kit = useUIKit();
  const { globalStore } = useGlobalStore();
  const parsed = useParsed();
  const { resource } = useResource();
  const { queryResult } = useShow<Model>({
    id: parsed?.params?.id,
  });
  const [mode, setMode] = useState<Mode>(Mode.Detail);
  const { t } = useTranslation();
  const { fold } = useK8sYamlEditor();
  const { data } = queryResult;
  if (!data?.data) {
    return null;
  }

  const model = data.data;

  const record = formatter ? formatter(model) : data?.data;

  const FirstLineFields: ShowField<Model>[] = [
    {
      key: 'NameSpace',
      title: t('dovetail.namespace'),
      path: ['metadata', 'namespace'],
    },
    {
      key: 'Age',
      title: t('dovetail.created_time'),
      path: ['metadata', 'creationTimestamp'],
      render(value) {
        return <Time date={new Date(value as string)} />;
      },
    },
  ];

  const SecondLineFields: ShowField<Model>[] = [
    {
      key: 'Labels',
      title: t('dovetail.label'),
      path: ['metadata', 'labels'],
      render: value => {
        if (!value) {
          return undefined;
        }
        return <Tags value={value as Record<string, string>} />;
      },
    },
    {
      key: 'Annotations',
      title: t('dovetail.annotation'),
      path: ['metadata', 'annotations'],
      render: value => {
        if (!value) {
          return undefined;
        }
        return <Tags value={value as Record<string, string>} />;
      },
    },
  ];

  function renderFields(fields: ShowField<Model>[]) {
    if (!record) return null;
    return fields.map(field => {
      let content;
      if (field.render) {
        content = field.render(get(record, field.path), record);
      } else {
        content = <span>{get(record, field.path)}</span>;
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
        <span className={Typo.Label.l1_regular}>{record?.metadata?.name}</span>
        <StateTag state={get(record, ['status', 'phase'])} />
      </div>
      <kit.space>
        <kit.radioGroup value={mode} onChange={e => setMode(e.target.value)}>
          <kit.radioButton value="detail">{t('dovetail.detail')}</kit.radioButton>
          <kit.radioButton value="yaml">YAML</kit.radioButton>
        </kit.radioGroup>
        <Dropdown record={record} />
      </kit.space>
    </kit.space>
  );

  const firstLine = (
    <kit.space size={8}>
      {renderFields([...FirstLineFields, ...(fieldGroups[0] || [])])}
    </kit.space>
  );
  const secondLine = <kit.space size={8}>{renderFields(fieldGroups[1])}</kit.space>;
  const labelAnnotations = (
    <kit.space direction="vertical">{renderFields(SecondLineFields)}</kit.space>
  );
  const tabs = (
    <kit.tabs>
      {fieldGroups[2].map(field => {
        let content;
        if (field.render) {
          content = field.render(get(record, field.path), record);
        } else {
          content = <span>{get(record, field.path)}</span>;
        }
        return (
          <kit.tabsTabPane tab={field.title} key={field.key}>
            {content}
          </kit.tabsTabPane>
        );
      })}
      <kit.tabsTabPane tab={t('dovetail.event')} key={'event'}>
        <EventsTable />
      </kit.tabsTabPane>
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
        defaultValue={yaml.dump(globalStore?.restoreItem(model))}
        schema={{}}
        onEditorCreate={editor => {
          fold(editor);
        }}
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

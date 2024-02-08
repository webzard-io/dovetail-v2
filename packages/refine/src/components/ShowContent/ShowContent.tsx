import { Typo, useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useParsed, useResource, useShow } from '@refinedev/core';
import yaml from 'js-yaml';
import { get, omit } from 'lodash-es';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/K8sDropdown';
import { KeyValueData } from 'src/components/KeyValueData';
import MonacoYamlEditor from 'src/components/YamlEditor/MonacoYamlEditor';
import useK8sYamlEditor from 'src/hooks/useK8sYamlEditor';
import { useGlobalStore } from '../../hooks';
import { ResourceModel } from '../../models';
import { EventsTable } from '../EventsTable';
import { StateTag } from '../StateTag';
import { Tags } from '../Tags';
import Time from '../Time';
import { ShowConfig, ShowField } from './fields';

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
const FieldWrapperStyle = css`
  display: flex;
  flex-wrap: nowrap;
`;

type Props<Model extends ResourceModel> = {
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
};

enum Mode {
  Detail = 'detail',
  Yaml = 'yaml',
}

export const ShowContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { showConfig, formatter, Dropdown = K8sDropdown } = props;
  const kit = useUIKit();
  const { globalStore } = useGlobalStore();
  const parsed = useParsed();
  const { resource } = useResource();
  const [mode, setMode] = useState<Mode>(Mode.Detail);
  const { queryResult } = useShow<Model>({
    id: parsed?.params?.id,
    liveMode: mode === Mode.Yaml ? 'off' : 'auto',
  });
  const { t } = useTranslation();
  const { fold } = useK8sYamlEditor();
  const { data } = queryResult;

  const schema = useMemo(() => ({}), []);
  const defaultEditorValue = useMemo(() => data?.data ?
    yaml.dump(omit(globalStore?.restoreItem(data.data), 'id'))
    : '',
    [globalStore, data]
  );

  const onEditorCreate = useCallback(editor => {
    fold(editor);
  }, [fold]);

  if (!data?.data) {
    return null;
  }

  const model = data.data;
  const record = formatter ? formatter(model) : data?.data;

  function renderFields(fields: ShowField<Model>[]) {
    if (!record) return null;

    return fields.map(field => {
      let content;
      const value = get(record, field.path);

      if (field.renderContent) {
        content = field.renderContent(value, record, field);
      } else {
        content = <span>{get(record, field.path)}</span>;
      }

      return (
        <kit.col span={field.col} key={field.path.join()}>
          {
            field.render ? field.render(value, record, field) : (
              <div className={FieldWrapperStyle}>
                <span
                  className={Typo.Label.l3_regular}
                  style={{ width: field.labelWidth || '64px' }}
                >{field.title}: </span>
                {content}
              </div>
            )
          }
        </kit.col>
      );
    });
  }

  const DESCRIPTION_DEFAULT_FIELDS: ShowField<Model>[] = [
    {
      key: 'NameSpace',
      title: t('dovetail.namespace'),
      path: ['metadata', 'namespace'],
    },
    {
      key: 'Age',
      title: t('dovetail.created_time'),
      path: ['metadata', 'creationTimestamp'],
      renderContent(value) {
        return <Time date={new Date(value as string)} />;
      },
    },
  ];
  const LABELS_ANNOTATIONS_GROUP_FIELDS: ShowField<Model>[] = [
    {
      key: 'Labels',
      title: t('dovetail.label'),
      path: ['metadata', 'labels'],
      col: 24,
      renderContent: value => {
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
      col: 24,
      renderContent: value => {
        if (!value) {
          return undefined;
        }
        return <KeyValueData datas={value as Record<string, string>} expandable />;
      },
    },
  ];

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
  const descriptions = (<kit.row gutter={24}>
    {renderFields([...DESCRIPTION_DEFAULT_FIELDS, ...(showConfig.descriptions || [])])}
  </kit.row>);
  const groups = (showConfig.groups || []).concat([{
    fields: LABELS_ANNOTATIONS_GROUP_FIELDS
  }]).map((group, index) => (
    <kit.row gutter={[24, 16]} key={index}>{renderFields(group.fields)}</kit.row>
  ));
  const tabs = (
    <kit.tabs>
      {(showConfig.tabs || []).map(field => {
        let content;
        if (field.renderContent) {
          content = field.renderContent(get(record, field.path), record, field);
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
        {groups}
        <kit.divider />
        {tabs}
      </>
    ),
    [Mode.Yaml]: (
      <MonacoYamlEditor
        className={EditorStyle}
        defaultValue={defaultEditorValue}
        schema={schema}
        onEditorCreate={onEditorCreate}
        readOnly
      />
    ),
  };

  return (
    <div>
      <kit.space direction="vertical" className={ShowContentStyle}>
        {topBar}
        {descriptions}
      </kit.space>
      <kit.divider />
      {modeMap[mode]}
    </div>
  );
};

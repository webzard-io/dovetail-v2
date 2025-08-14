import {
  Typo,
  Icon,
  AntdRowProps,
  Divider,
  Space,
  Col,
  Row,
  Button,
} from '@cloudtower/eagle';
import {
  ArrowChevronLeft16BoldTertiaryIcon,
  ArrowChevronLeftSmall16BoldBlueIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { useShow, useNavigation, useGo, CanAccess } from '@refinedev/core';
import { get } from 'lodash-es';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/Dropdowns/K8sDropdown';
import { Tabs as BaseTabs } from 'src/components/Tabs';
import ValueDisplay from 'src/components/ValueDisplay';
import { AccessControlAuth } from 'src/constants/auth';
import ComponentContext from 'src/contexts/component';
import ConfigsContext from 'src/contexts/configs';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { FormType } from 'src/types';
import { ResourceState } from '../../constants';
import { ResourceModel } from '../../models';
import { StateTag } from '../StateTag';
import { ShowConfig, ShowField, AreaType, ShowGroup } from './fields';
const ShowContentWrapperStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, $white 0%, $gray-20 100%);

  .ant-row {
    margin-right: 0 !important;
  }
`;
const BackButton = css`
  color: $gray-a30-10;
  line-height: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;

  &:hover {
    color: $blue-60;
  }
`;
const ToolBarWrapper = css`
  display: flex;
  flex-direction: column;
  padding: 16px 24px 8px 24px;
  background-color: $white;
`;
const NameStyle = css`
  color: $gray-120;
  margin-right: 8px;
`;
const TopBarStyle = css`
  justify-content: space-between;
  width: 100%;
`;
const ShowContentHeaderStyle = css`
  width: 100%;
`;
const GroupStyle = css`
  padding: 12px 16px;
  padding-bottom: 4px;
  border-radius: 8px;
  border: 1px solid $gray-a60-3;
  box-shadow:
    0px 0px 2.003px 0px rgba($gray-70, 0.15),
    0px 0px 16px 0px rgba($gray-70, 0.08);
  background-color: $white;
  margin: 0 24px;
  overflow: auto;
  width: calc(100% - 48px);
  max-width: 1592px;
  margin-bottom: 24px;

  &:first-of-type {
    margin-top: 16px;
  }

  .pagination-wrapper {
    padding-top: 12px;
    padding-bottom: 0;
  }
`;
const GroupTitleStyle = css`
  display: flex;
  color: $blue-100;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`;
const FullTabContentStyle = css`
  background-color: $white;
  height: 100%;
`;
const FieldWrapperStyle = css`
  display: flex;
  flex-wrap: nowrap;
`;
const TabContentStyle = css`
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 904px;
`;
const ValueStyle = css`
  color: $gray-120;
`;
const TabsStyle = css`
  &.ant-tabs {
    flex: 1;
    min-height: 0;

    .ant-tabs-nav {
      margin-bottom: 0;
      margin-right: 24px;
    }

    .ant-tabs-nav-list {
      margin-left: 24px;
    }

    .ant-tabs-content-holder {
      overflow: auto;

      .ant-tabs-content,
      .ant-tabs-tabpane-active {
        height: 100%;
      }
    }
  }
`;

export type ShowContentViewProps<Model extends ResourceModel> = {
  id: string;
  resourceName: string;
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
  hideBackButton?: boolean;
};

type ShowGroupComponentProps = React.PropsWithChildren<{
  title: string;
  className?: string;
  operationEle?: React.ReactElement | null;
}>;

export function ShowGroupComponent(props: ShowGroupComponentProps) {
  const { title, className, children, operationEle } = props;

  return (
    <div className={cx(GroupStyle, className)}>
      <div className={cx(Typo.Heading.h2_bold_title, GroupTitleStyle)}>
        <div>{title}</div>
        {operationEle}
      </div>
      {children}
    </div>
  );
}

export const ShowContentView = <Model extends ResourceModel>(
  props: ShowContentViewProps<Model>
) => {
  const {
    id,
    resourceName,
    showConfig,
    formatter,
    Dropdown = K8sDropdown,
    hideBackButton = false,
  } = props;
  const { queryResult } = useShow<Model>({
    id,
    resource: resourceName,
    errorNotification: false,
  });
  const { t } = useTranslation();
  const { data } = queryResult;
  const navigation = useNavigation();
  const go = useGo();
  const openForm = useOpenForm();
  const Component = useContext(ComponentContext);
  const configs = useContext(ConfigsContext);
  const config = configs[resourceName];
  const Tabs = Component.Tabs || BaseTabs;

  if (!data?.data) {
    return null;
  }

  const model = data.data;
  const record = formatter ? formatter(model) : data?.data;

  function renderFields(fields: ShowField<Model>[], areaType?: AreaType, hasCol = true) {
    if (!record) return null;

    return fields.map(field => {
      if (field.hidden) return null;
      let content;
      const value = get(record, field.path);

      if (field.renderContent) {
        content = field.renderContent(value, record, field);
      } else {
        content = get(record, field.path);
      }

      return hasCol ? (
        <Col
          flex={areaType === AreaType.Inline ? 'none' : ''}
          span={field.col || 24}
          key={field.key}
          className={css`
            padding: 4px 0;
          `}
        >
          {field.render ? (
            field.render(value, record, field)
          ) : (
            <div className={FieldWrapperStyle}>
              {field.title && (
                <span
                  className={Typo.Label.l4_regular_title}
                  style={{
                    width: field.labelWidth || '165px',
                    marginRight: 8,
                    flexShrink: 0,
                    color: '#2C385299',
                  }}
                >
                  {field.title}
                </span>
              )}
              <span style={{ flex: 1, minWidth: 0 }}>
                <ValueDisplay
                  className={cx(Typo.Label.l4_regular_title, ValueStyle)}
                  value={content}
                  useOverflow={false}
                />
              </span>
            </div>
          )}
        </Col>
      ) : (
        <ValueDisplay style={{ height: '100%' }} value={content} useOverflow={false} />
      );
    });
  }

  function renderGroup(group: ShowGroup<Model>) {
    const GroupContainer = group.title ? ShowGroupComponent : React.Fragment;
    const FieldContainer = group.title ? Row : React.Fragment;
    const groupContainerProps = group.title ? { title: group.title || '' } : {};
    const fieldContainerProps = group.title ? { gutter: [24, 8] } : {};

    return (
      <GroupContainer
        key={group.title}
        {...(groupContainerProps as ShowGroupComponentProps)}
      >
        {group.areas.map((area, index) => (
          <>
            <FieldContainer key={index} {...(fieldContainerProps as AntdRowProps)}>
              {renderFields(area.fields, area.type, !!group.title)}
            </FieldContainer>
            {index !== group.areas.length - 1 ? (
              <Divider style={{ margin: '8px 0 12px 0' }} />
            ) : null}
          </>
        ))}
      </GroupContainer>
    );
  }

  const stateDisplay = get(record, 'stateDisplay') as ResourceState;
  const topBar = (
    <div className={ToolBarWrapper}>
      {!hideBackButton && (
        <div
          className={cx(Typo.Label.l4_bold, BackButton)}
          onClick={() => {
            go({
              to: navigation.listUrl(resourceName),
            });
          }}
        >
          <Icon
            src={ArrowChevronLeft16BoldTertiaryIcon}
            hoverSrc={ArrowChevronLeftSmall16BoldBlueIcon}
            style={{ marginRight: 4 }}
          >
            <span className="button-text">{config?.displayName || resourceName}</span>
          </Icon>
        </div>
      )}
      <Space className={TopBarStyle}>
        <div style={{ display: 'flex' }}>
          <span className={cx(Typo.Display.d2_regular_title, NameStyle)}>
            {showConfig.displayName?.(record) || record?.metadata?.name}
          </span>
          {stateDisplay ? (
            <StateTag
              state={stateDisplay}
              customResourceStateMap={showConfig.resourceStateMap}
            />
          ) : undefined}
        </div>
        <Space>
          {showConfig.renderExtraButton?.(record)}
          {!config.hideEdit ? (
            <CanAccess
              resource={resourceName}
              action={AccessControlAuth.Edit}
              params={{
                namespace: record.namespace,
              }}
            >
              <Button style={{ marginRight: 8 }} onClick={() => openForm({ id })}>
                {config.formConfig?.formType === FormType.FORM
                  ? t('dovetail.edit')
                  : t('dovetail.edit_yaml')}
              </Button>
            </CanAccess>
          ) : null}
          <Dropdown record={record} size="large" />
        </Space>
      </Space>
    </div>
  );
  const tabs = (
    <Tabs
      tabs={(showConfig.tabs || []).map((tab, tabIndex) => {
        return {
          title: tab.title,
          key: tab.key,
          children: (
            <div
              className={cx(
                TabContentStyle,
                tab.groups.length <= 1 && tabIndex !== 0 && FullTabContentStyle
              )}
            >
              {tab.groups?.map(renderGroup)}
            </div>
          ),
        };
      })}
      className={TabsStyle}
    />
  );

  const basicInfo = showConfig.basicGroup ? renderGroup(showConfig.basicGroup) : null;

  return (
    <div className={ShowContentWrapperStyle}>
      <Space direction="vertical" className={ShowContentHeaderStyle}>
        {topBar}
      </Space>
      {basicInfo}
      {tabs}
    </div>
  );
};

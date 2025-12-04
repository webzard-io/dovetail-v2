import {
  Typo,
  Icon,
  AntdRowProps,
  Divider,
  Space,
  Col,
  Row,
  Button,
  Tag,
} from '@cloudtower/eagle';
import {
  ArrowChevronDownSmall16BlueIcon,
  ArrowChevronLeft16BoldTertiaryIcon,
  ArrowChevronLeftSmall16BoldBlueIcon,
  ArrowChevronUpSmall16BlueIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import { useShow, useNavigation, useGo, CanAccess } from '@refinedev/core';
import { get } from 'lodash-es';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/Dropdowns/K8sDropdown';
import { Tabs as BaseTabs } from 'src/components/Tabs';
import ValueDisplay from 'src/components/ValueDisplay';
import { AccessControlAuth } from 'src/constants/auth';
import ComponentContext from 'src/contexts/component';
import ConfigsContext from 'src/contexts/configs';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { FormType } from 'src/types';
import { transformResourceKindInSentence } from 'src/utils/string';
import { ResourceState } from '../../constants';
import { ResourceModel } from '../../models';
import { StateTag } from '../StateTag';
import { ShowConfig, ShowField, AreaType, ShowGroup } from './fields';

const ShowContentWrapperStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, $white 0%, $gray-20 100%);
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
  box-shadow: 0px 0px 2.003px 0px rgba($gray-70, 0.15),
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

const BasicGroupStyle = css`
  margin: 0 24px 0 24px;
  overflow: auto;
`;

const GroupTitleStyle = css`
  display: flex;
  color: $blue-100;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`;
const FullTabContentStyle = css`
  height: 100%;
`;
const FieldWrapperStyle = css`
  display: flex;
  flex-wrap: nowrap;
`;
const TabContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 904px;
  overflow: auto;
`;
const ValueStyle = css`
  color: $gray-120;
`;
const TabsStyle = css`
  &.ant-tabs {
    flex: 1;
    min-height: 0;
    margin-top: 16px;

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
const SmallTabsStyle = css`
  &.ant-tabs {
    margin-top: 12px;
  }
`;

const KindTagStyle = css`
  margin: auto 0;
  margin-right: 8px;
  border: 1px solid #acbad399;
  background-color: white;
`;

export type ShowContentViewProps<Model extends ResourceModel> = React.PropsWithChildren<{
  id: string;
  resourceName: string;
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
  hideBackButton?: boolean;
  canCollapseTabs?: boolean;
  hideTopBar?: boolean;
  className?: string;
  size?: 'small' | 'medium';
}>;

type ShowGroupComponentProps = React.PropsWithChildren<{
  title: string;
  className?: string;
  size?: 'small' | 'medium';
  operationEle?: React.ReactElement | null;
  [key: string]: unknown;
}>;

export function ShowGroupWithTitleComponent(props: ShowGroupComponentProps) {
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

type BasicShowGroupComponentProps = React.PropsWithChildren<{
  size?: 'small' | 'medium';
  [key: string]: unknown;
}>;

export function BasicShowGroupComponent(props: BasicShowGroupComponentProps) {
  const { children, size = 'medium' } = props;

  return (
    <div
      className={cx(BasicGroupStyle, 'basic-group')}
      style={{
        margin: size === 'small' ? '12px 8px 0px 12px' : undefined,
      }}
    >
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
    children,
    Dropdown = K8sDropdown,
    hideBackButton = false,
    canCollapseTabs = false,
    className,
    hideTopBar = false,
    size = 'medium',
  } = props;
  const { queryResult } = useShow<Model>({
    id,
    resource: resourceName,
    errorNotification: false,
  });
  const { t, i18n } = useTranslation();
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
      const shouldHide =
        typeof field.hidden === 'function' ? field.hidden(record) : field.hidden;

      if (shouldHide) return null;

      let content;
      const value = get(record, field.path);

      if (field.renderContent) {
        content = field.renderContent(value, record, field, size);
      } else {
        content = get(record, field.path);
      }

      if (hasCol) {
        return (
          <Col
            flex={areaType === AreaType.Inline ? 'none' : ''}
            span={field.col || 24}
            key={field.key}
            className={css`
              padding: 4px 0;
            `}
          >
            {field.render ? (
              field.render(value, record, field, size)
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
        );
      }

      return field.render ? (
        field.render(value, record, field, size)
      ) : (
        <ValueDisplay style={{ height: '100%' }} value={content} useOverflow={false} />
      );
    });
  }

  function renderGroup(group: ShowGroup<Model>, isBasicGroup = false) {
    let GroupContainer:
      | React.FC<ShowGroupComponentProps>
      | React.FC<BasicShowGroupComponentProps> = React.Fragment;
    let FieldContainer = React.Fragment;
    const groupContainerProps = { title: group.title || '', size };
    let fieldContainerProps = {};

    if (isBasicGroup) {
      // 基本组不需要卡片和阴影的样式
      GroupContainer = BasicShowGroupComponent;
    } else if (group.title) {
      // 有标题时，需要用有标题的容器
      GroupContainer = ShowGroupWithTitleComponent;
    }

    // 基本组和有标题的时候，都需要Row组件包裹，以便showConfig里的col的属性生效
    const shouldRenderRow = !!(isBasicGroup || group.title);

    if (shouldRenderRow) {
      FieldContainer = Row;
      fieldContainerProps = {
        gutter: [24, 8],
        className: css`
          &.ant-row {
            row-gap: 4px;
            margin-right: 0 !important;
          }
        `,
      };
    }

    return (
      <GroupContainer key={group.title} {...groupContainerProps}>
        {group.areas.map((area, index) => (
          <>
            <FieldContainer key={index} {...(fieldContainerProps as AntdRowProps)}>
              {renderFields(area.fields, area.type, shouldRenderRow)}
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
    <div
      className={ToolBarWrapper}
      style={{
        padding: size === 'small' ? '8px 16px' : undefined,
      }}
    >
      {!hideBackButton && !showConfig.renderCustomBackButton && (
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
      {showConfig.renderCustomBackButton?.(record)}
      <Space className={TopBarStyle}>
        <div style={{ display: 'flex' }}>
          <Tag.NameTag className={KindTagStyle}>{config.kind}</Tag.NameTag>
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
                  ? `${t('dovetail.edit')}${transformResourceKindInSentence(
                      config.displayName || config.kind,
                      i18n.language
                    )}`
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
      tabs={(showConfig.tabs || []).map(tab => {
        return {
          title: tab.title,
          key: tab.key,
          children: (
            <div
              className={cx(
                TabContentStyle,
                tab.groups.length <= 1 && FullTabContentStyle
              )}
              style={{
                background: tab.background === 'white' ? '#fff' : undefined,
              }}
            >
              {tab.groups?.map(group => renderGroup(group, false))}
            </div>
          ),
        };
      })}
      className={cx(TabsStyle, size === 'small' && SmallTabsStyle)}
    />
  );

  const basicInfo = showConfig.basicGroup
    ? renderGroup(showConfig.basicGroup, true)
    : null;

  return (
    <div
      className={cx(ShowContentWrapperStyle, className)}
      style={{
        background: size === 'small' ? '#fff' : undefined,
      }}
    >
      {hideTopBar ? null : (
        <Space direction="vertical" className={ShowContentHeaderStyle}>
          {topBar}
        </Space>
      )}
      {basicInfo}

      {canCollapseTabs ? <CollapseTabs>{tabs}</CollapseTabs> : tabs}
      {children}
    </div>
  );
};

const CollapseTabs: React.FC = props => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { t } = useTranslation();
  return (
    <>
      {isCollapsed ? null : props.children}
      <div style={{ display: 'flex' }}>
        <Button
          style={{ margin: '8px auto', cursor: 'pointer' }}
          size="small"
          type="link"
          onClick={() => setIsCollapsed(v => !v)}
          suffixIcon={
            isCollapsed ? (
              <Icon src={ArrowChevronDownSmall16BlueIcon} />
            ) : (
              <Icon src={ArrowChevronUpSmall16BlueIcon} />
            )
          }
        >
          {isCollapsed ? t('dovetail.view_all_info') : t('dovetail.collapse')}
        </Button>
      </div>
    </>
  );
};

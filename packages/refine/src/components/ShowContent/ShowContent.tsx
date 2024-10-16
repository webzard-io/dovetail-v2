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
  EditPen16GradientBlueIcon,
} from '@cloudtower/icons-react';
import { css, cx } from '@linaria/core';
import {
  useParsed,
  useResource,
  useShow,
  useNavigation,
  useGo,
  CanAccess,
} from '@refinedev/core';
import { get } from 'lodash-es';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import K8sDropdown from 'src/components/Dropdowns/K8sDropdown';
import { Tabs as BaseTabs } from 'src/components/Tabs';
import ValueDisplay from 'src/components/ValueDisplay';
import { AccessControlAuth } from 'src/constants/auth';
import ComponentContext from 'src/contexts/component';
import { useOpenForm } from 'src/hooks/useOpenForm';
import { WorkloadState } from '../../constants';
import { ResourceModel } from '../../models';
import { StateTag } from '../StateTag';
import { ShowConfig, ShowField, AreaType } from './fields';

const ShowContentWrapperStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff 0%, #edf0f7 100%);

  .ant-row {
    margin-right: 0 !important;
  }
`;
const BackButton = css`
  color: rgba(0, 21, 64, 0.3);
  line-height: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;

  &:hover {
    color: #0080ff;
  }
`;
const ToolBarWrapper = css`
  display: flex;
  flex-direction: column;
  padding: 16px 24px 8px 24px;
  background-color: #fff;
`;
const NameStyle = css`
  color: #00122e;
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
  border: 1px solid rgba(211, 218, 235, 0.6);
  box-shadow:
    0px 0px 2.003px 0px rgba(107, 125, 153, 0.15),
    0px 0px 16px 0px rgba(107, 125, 153, 0.08);
  background-color: #fff;
  margin: 0 24px;
  overflow: auto;
  width: calc(100% - 48px);
  max-width: 1592px;

  &:first-of-type {
    margin-top: 16px;
  }

  &:not(:last-of-type) {
    margin-bottom: 24px;
  }

  .pagination-wrapper {
    padding-top: 12px;
    padding-bottom: 0;
  }
`;
const GroupTitleStyle = css`
  display: flex;
  color: #1d326c;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`;
const FullTabContentStyle = css`
  background-color: #fff;
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
  color: #00122e;
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

type Props<Model extends ResourceModel> = {
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
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

export const ShowContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { showConfig, formatter, Dropdown = K8sDropdown } = props;
  const parsed = useParsed();
  const { resource } = useResource();
  const id = parsed?.params?.id;
  const { queryResult } = useShow<Model>({
    id,
    errorNotification: false,
  });
  const { t } = useTranslation();
  const { data } = queryResult;
  const navigation = useNavigation();
  const go = useGo();
  const openForm = useOpenForm({ id });
  const Component = useContext(ComponentContext);
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
          key={field.path.join()}
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

  const stateDisplay = get(record, 'stateDisplay') as WorkloadState;
  const topBar = (
    <div className={ToolBarWrapper}>
      <span
        className={cx(Typo.Label.l4_bold, BackButton)}
        onClick={() => {
          go({
            to: navigation.listUrl(resource?.name || ''),
          });
        }}
      >
        <Icon
          src={ArrowChevronLeft16BoldTertiaryIcon}
          hoverSrc={ArrowChevronLeftSmall16BoldBlueIcon}
          style={{ marginRight: 4 }}
        >
          <span className="button-text">{resource?.meta?.kind}</span>
        </Icon>
      </span>
      <Space className={TopBarStyle}>
        <div style={{ display: 'flex' }}>
          <span className={cx(Typo.Display.d2_regular_title, NameStyle)}>
            {record?.metadata?.name}
          </span>
          {stateDisplay ? <StateTag state={stateDisplay} /> : undefined}
        </div>
        <Space>
          {showConfig.renderExtraButton?.(record)}
          {!showConfig.hideEditYamlButton ? (
            <CanAccess resource={resource?.name} action={AccessControlAuth.Edit}>
              <Button
                style={{ marginRight: 8 }}
                onClick={openForm}
                prefixIcon={<EditPen16GradientBlueIcon />}
              >
                {t('dovetail.edit_yaml')}
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
            >
              {tab.groups?.map(group => {
                const GroupContainer = group.title ? ShowGroupComponent : React.Fragment;
                const FieldContainer = group.title ? Row : React.Fragment;
                const groupContainerProps = group.title
                  ? { title: group.title || '' }
                  : {};
                const fieldContainerProps = group.title ? { gutter: [24, 8] } : {};

                return (
                  <GroupContainer
                    key={group.title}
                    {...(groupContainerProps as ShowGroupComponentProps)}
                  >
                    {group.areas.map((area, index) => (
                      <>
                        <FieldContainer
                          key={index}
                          {...(fieldContainerProps as AntdRowProps)}
                        >
                          {renderFields(area.fields, area.type, !!group.title)}
                        </FieldContainer>
                        {index !== group.areas.length - 1 ? (
                          <Divider style={{ margin: '8px 0 12px 0' }} />
                        ) : null}
                      </>
                    ))}
                  </GroupContainer>
                );
              })}
            </div>
          ),
        };
      })}
      className={TabsStyle}
    />
  );

  return (
    <div className={ShowContentWrapperStyle}>
      <Space direction="vertical" className={ShowContentHeaderStyle}>
        {topBar}
      </Space>
      {tabs}
    </div>
  );
};

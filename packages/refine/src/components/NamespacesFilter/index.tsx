import { useUIKit } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useList, useResource } from '@refinedev/core';
import { last, debounce } from 'lodash-es';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { ConfigsContext } from '../../contexts';

const SelectStyle = css`
&.ant-select {
  .ant-select-selector {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 4px;

    & > span {
      max-width: calc(100% - 76px);
      flex-shrink: 0;
    }
  }

  .ant-select-selection-search {
    display: none;
  }

  .zoom-leave {
    opacity: 0;
    position: absolute;
  }
}
`;
const DropdownStyle = css`
  border-radius: 6px;
`;
const SearchInputStyle = css`
  &&.ant-input-affix-wrapper {
    border: unset;
    border-bottom: 1px solid rgba(211, 218, 235, .6);
    border-radius: unset;
    box-shadow: unset;
    outline: unset;
    padding: 5px 18px;

    &:hover,
    &:focus {
      box-shadow: unset;
      outline: unset;
    }
  }
`;
const SelectContentStyle = css`
  .ant-select-item-group {
    border-bottom: 1px solid rgba(211, 218, 235, 0.6);
    min-height: 0;
    padding: 0;
    overflow: hidden;
    margin: 6px 0;
  }
`;
const TokenStyle = css`
  max-width: 100%;
  margin-right: 0 !important;
`;
const CountTokenStyle = css`
  flex-shrink: 0;
  margin-right: 0;
`;
const SelectOptionGroupStyle = css`
`;
const LabelWrapperStyle = css`
  margin-right: 8px;
`;
const AllNamespaceOptionStyle = css`
  border-radius: 4px;
  margin: 6px;
  margin-bottom: 0;
  padding: 4px 8px 4px 12px;
`;
const OptionStyle = css`
  &.ant-select-item {
    margin: 0 6px;
    border-radius: 4px;
    padding: 4px 8px 4px 12px;

    &:not(:last-of-type) {
      margin-bottom: 3px;
    }
    &:last-of-type {
      margin-bottom: 6px;
    }
  }
`;

export const NS_STORE_KEY = 'namespace-filter';
export const ALL_NS = '_all';

export const useNamespacesFilter = () => {
  const [value] = useLocalStorage<string[]>(NS_STORE_KEY, [ALL_NS]);
  const { resource } = useResource();
  const configs = useContext(ConfigsContext);

  if (resource?.name && configs[resource?.name].hideNamespacesFilter) {
    // if namespaceFilter is hidden, don't read filter in localstorage
    return {
      value: [],
    };
  }

  return {
    value,
  };
};

interface NamespaceFilterProps {
  className?: string;
}

export const NamespacesFilter: React.FC<NamespaceFilterProps> = ({ className }) => {
  const kit = useUIKit();
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useList({
    resource: 'namespaces',
    meta: {
      resourceBasePath: '/api/v1',
      kind: 'Namespace',
    },
    pagination: {
      mode: 'off'
    }
  });
  const [value, setValue] = useLocalStorage<string[]>(NS_STORE_KEY, [ALL_NS]);
  const debouncedSetSearch = debounce(setSearch, 100);

  return (
    <kit.select
      loading={isLoading}
      style={{ width: 278 }}
      className={cx(SelectStyle, className)}
      dropdownClassName={DropdownStyle}
      searchValue={search}
      virtual={false}
      input={{
        value,
        onChange(value) {
          if (last(value) === ALL_NS || value.length === 0) {
            setValue([ALL_NS]);
          } else {
            setValue((value as string[]).filter(namespace => namespace !== ALL_NS));
          }
        },
      }}
      dropdownRender={(menu) => (
        <div className={SelectContentStyle}>
          <kit.searchInput
            style={{ width: '100%' }}
            className={SearchInputStyle}
            onChange={debouncedSetSearch}
            placeholder={t('dovetail.please_input')}
          />
          {menu}
          {isLoading ? <kit.loading /> : null}
        </div>
      )}
      tagRender={({ label, value, closable, onClose }) => {
        const isCountToken = label !== value && typeof label === 'string';
        const isAll = value === ALL_NS;

        return isAll ? <span style={{ marginLeft: 8 }}>{label}</span> : (
          <kit.token
            className={cx(isCountToken ? CountTokenStyle : TokenStyle, isCountToken ? '' : 'closable-token')}
            closable={closable}
            size='medium'
            onClose={onClose}
          >
            <kit.overflowTooltip content={isCountToken ? label.replace(/[\s\.]/g, '') : label} />
          </kit.token>
        );
      }}
      maxTagCount={1}
      optionLabelProp='label'
      showArrow
      showSearch={false}
      multiple
    >
      <kit.option key="_all" value="_all" label={t('dovetail.all_namespaces')} className={AllNamespaceOptionStyle}>
        <kit.overflowTooltip content={t('dovetail.all_namespaces')} className={LabelWrapperStyle}>
        </kit.overflowTooltip>
      </kit.option>
      <kit.selectOptGroup label="" className={SelectOptionGroupStyle}>
        {data?.data.map(namespace => {
          const { name } = namespace.metadata;

          return (
            <kit.option key={name} value={name} label={name} className={OptionStyle}>
              <kit.overflowTooltip content={name} className={LabelWrapperStyle}>
              </kit.overflowTooltip>
            </kit.option>
          );
        })}
      </kit.selectOptGroup>
    </kit.select>
  );
};

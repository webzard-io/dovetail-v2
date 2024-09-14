import { Select, SearchInput, OverflowTooltip, AntdOption, AntdSelectOptGroup, Loading, Token, Tooltip, Divider } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { useList, useResource } from '@refinedev/core';
import { last, debounce } from 'lodash-es';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { ConfigsContext } from '../../contexts';

const SelectStyle = css`
&.ant-select {
  align-self: flex-start;
  min-width: 276px;
  max-width: 100%;

  .ant-select-selector {
    display: block;
    overflow: hidden;
    padding-right: 32px;
    white-space: nowrap;

    & > span:nth-child(-n + 8):not(.ant-select-selection-search) {
      display: inline-block;
      max-width: var(--tag-max-width);
      margin-right: 4px;
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
  margin-right: 0 !important;
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
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [tagMaxWidth, setTagMaxWidth] = useState<string>('');
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
  const [open, setOpen] = useState<boolean>(false);
  const debouncedSetSearch = debounce(setSearch, 100);
  const MAX_TAG_COUNT = 8;
  const COUNT_TAG_WIDTH = 22;
  const TAG_GAP = 4;
  const PADDING = 36;
  const hasCountTag = value.length > MAX_TAG_COUNT;
  const WRAPPER_CLASS = 'd2-namespace-select-wrapper';
  const SELECT_CLASS = 'd2-namespace-select';

  const calcTagMaxWidth = useCallback(() => {
    // The maximum label width is calculated based on the current selector width,
    // and the remaining width after removing some fixed widths is divided equally by the current number of labels
    const wrapper = document.querySelector<HTMLDivElement>(`.${WRAPPER_CLASS}`);
    const n = Math.min(value.length, MAX_TAG_COUNT);
    const tagWidth = (wrapper?.offsetWidth || 0) / n;
    const gapsWidth = (Math.min(value.length, MAX_TAG_COUNT + 1) - 1) * TAG_GAP;
    const paddingAndCountTagWidth = PADDING + (hasCountTag ? COUNT_TAG_WIDTH : 0);
    const perTagMaxWidth = tagWidth - (paddingAndCountTagWidth + gapsWidth) / n;

    setTagMaxWidth(`${perTagMaxWidth}px`);
  }, [value, hasCountTag]);
  useEffect(() => {
    calcTagMaxWidth();
  }, [calcTagMaxWidth]);
  useEffect(() => {
    window.addEventListener('resize', calcTagMaxWidth);

    return () => {
      window.removeEventListener('resize', calcTagMaxWidth);
    };
  }, [calcTagMaxWidth]);

  return (
    <div className={WRAPPER_CLASS}>
      <Select
        loading={isLoading}
        className={cx(SelectStyle, SELECT_CLASS, className)}
        style={
          { '--tag-max-width': tagMaxWidth } as React.CSSProperties
        }
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
            <SearchInput
              style={{ width: '100%' }}
              className={SearchInputStyle}
              onChange={debouncedSetSearch}
              placeholder={t('dovetail.please_input')}
            />
            {menu}
            {isLoading ? <Loading /> : null}
          </div>
        )}
        tagRender={({ label, value: namespaceValue, closable, onClose }) => {
          const isCountToken = label !== namespaceValue && typeof label === 'string';
          const isAll = namespaceValue === ALL_NS;

          return (
            <span onClick={() => { setOpen(!open); }}>
              {
                isAll ? (
                  <span style={{ marginLeft: 8 }}>{label}</span>
                ) : (
                  <Token
                    className={cx(isCountToken ? CountTokenStyle : TokenStyle, isCountToken ? '' : 'closable-token')}
                    closable={closable}
                    size='medium'
                    onClose={onClose}
                  >

                    <OverflowTooltip
                      content={
                        isCountToken ?
                          (
                            <Tooltip
                              title={(
                                isCountToken ? value.slice(MAX_TAG_COUNT).map((namespace, index) => (
                                  <>
                                    <div>{namespace}</div>
                                    {
                                      index !== value.length - 1 - MAX_TAG_COUNT ? <Divider style={{ margin: '6px 0', borderColor: 'rgba(107, 128, 167, 0.60)' }} /> : null
                                    }
                                  </>
                                )) : null
                              )}
                              trigger={['hover']}
                            >
                              <span>{label.replace(/[\s\.]/g, '')}</span>
                            </Tooltip>
                          ) :
                          label
                      }
                    />
                  </Token>
                )
              }
            </span>
          );
        }}
        maxTagCount={MAX_TAG_COUNT}
        optionLabelProp='label'
        showArrow
        showSearch={false}
        open={open}
        onDropdownVisibleChange={(open) => { setOpen(open); }}
        multiple
      >
        <AntdOption key="_all" value="_all" label={t('dovetail.all_namespaces')} className={AllNamespaceOptionStyle}>
          <OverflowTooltip content={t('dovetail.all_namespaces')} className={LabelWrapperStyle} />
        </AntdOption>
        <AntdSelectOptGroup label="" className={SelectOptionGroupStyle}>
          {data?.data.map(namespace => {
            const { name } = namespace.metadata;

            return (
              <AntdOption key={name} value={name} label={name} className={OptionStyle}>
                <OverflowTooltip content={name} className={LabelWrapperStyle} />
              </AntdOption>
            );
          })}
        </AntdSelectOptGroup>
      </Select>
    </div>
  );
};

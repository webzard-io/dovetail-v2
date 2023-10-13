/* eslint-disable react-hooks/rules-of-hooks */
import {
  GoConfig,
  ParseResponse,
  RouterBindings,
  matchResourceFromRoute,
  ResourceContext,
} from '@refinedev/core';
import { parse, stringify } from 'qs';
import React, { ComponentProps } from 'react';
import { useCallback, useContext } from 'react';
import { useHistory, useLocation, Link, matchPath, useParams } from 'react-router-dom';

export const stringifyConfig = {
  addQueryPrefix: true,
  skipNulls: true,
  arrayFormat: 'indices' as const,
  encode: false,
  encodeValuesOnly: true,
};

export const convertToNumberIfPossible = (value: string | undefined) => {
  if (typeof value === 'undefined') {
    return value;
  }
  const num = Number(value);
  if (`${num}` === value) {
    return num;
  }
  return value;
};

export const routerProvider = {
  go: () => {
    const { search: existingSearch, hash: existingHash } = useLocation();
    const history = useHistory();

    const fn = useCallback(
      ({ to, type, query, hash, options: { keepQuery, keepHash } = {} }: GoConfig) => {
        /** Construct query params */
        const urlQuery = {
          ...(keepQuery &&
            existingSearch &&
            parse(existingSearch, { ignoreQueryPrefix: true })),
          ...query,
        };

        if (urlQuery.to) {
          urlQuery.to = encodeURIComponent(`${urlQuery.to}`);
        }

        const hasUrlQuery = Object.keys(urlQuery).length > 0;

        /** Get hash */
        const urlHash = `#${(hash || (keepHash && existingHash) || '').replace(
          /^#/,
          ''
        )}`;

        const hasUrlHash = urlHash.length > 1;

        const urlTo = to || '';

        const fullPath = `${urlTo}${
          hasUrlQuery ? stringify(urlQuery, stringifyConfig) : ''
        }${hasUrlHash ? urlHash : ''}`;

        if (type === 'path') {
          return fullPath;
        }

        /** Navigate to the url */
        return history[type || 'push'](fullPath);
      },
      [existingHash, existingSearch, history]
    );

    return fn;
  },
  back: () => {
    const history = useHistory();

    const fn = useCallback(() => {
      history.go(-1);
    }, [history]);

    return fn;
  },
  parse: () => {
    let params = useParams();
    const { pathname, search } = useLocation();
    const { resources } = useContext(ResourceContext);

    const { resource, action, matchedRoute } = React.useMemo(() => {
      return matchResourceFromRoute(pathname, resources);
    }, [resources, pathname]);

    // params is empty when useParams is used in a component that is not a child of a Route
    if (Object.entries(params).length === 0 && matchedRoute) {
      params = matchPath(matchedRoute, pathname)?.params || {};
    }

    const fn = useCallback(() => {
      const parsedSearch = parse(search, { ignoreQueryPrefix: true });

      const combinedParams: Record<string, unknown> = {
        ...params,
        ...parsedSearch,
      };

      const response: ParseResponse = {
        ...(resource && { resource }),
        ...(action && { action }),
        ...(parsedSearch?.id && { id: decodeURIComponent(parsedSearch.id as string) }),
        // ...(params?.action && { action: params.action }), // lets see if there is a need for this
        pathname,
        params: {
          ...combinedParams,
          current: convertToNumberIfPossible(combinedParams.current as string) as
            | number
            | undefined,
          pageSize: convertToNumberIfPossible(combinedParams.pageSize as string) as
            | number
            | undefined,
          to: combinedParams.to
            ? decodeURIComponent(combinedParams.to as string)
            : undefined,
        },
      };

      return response;
    }, [pathname, search, params, resource, action]);

    return fn;
  },
  Link: React.forwardRef<
    HTMLAnchorElement,
    ComponentProps<NonNullable<RouterBindings['Link']>>
  >(function RefineLink(props, ref) {
    return <Link {...props} ref={ref} />;
  }),
};

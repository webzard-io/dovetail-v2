import routerBindings from '@refinedev/react-router-v6';
import React, { ComponentProps } from "react";
import {
    ParseResponse,
    matchResourceFromRoute,
    ResourceContext,
} from "@refinedev/core";
import { useCallback, useContext } from "react";
import { parse } from "qs";
import {
    useLocation,
    matchPath,
    useParams,
} from "react-router-dom";

export const convertToNumberIfPossible = (value: string | undefined) => {
  if (typeof value === "undefined") {
      return value;
  }
  const num = Number(value);
  if (`${num}` === value) {
      return num;
  }
  return value;
};


export const routerProvider = {
  ...routerBindings,
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

      const combinedParams = {
        ...params,
        ...parsedSearch,
      };

      const response: ParseResponse = {
        ...(resource && { resource }),
        ...(action && { action }),
        ...(parsedSearch?.id && { id: decodeURIComponent(parsedSearch.id) }),
        // ...(params?.action && { action: params.action }), // lets see if there is a need for this
        pathname,
        params: {
          ...combinedParams,
          current: convertToNumberIfPossible(
            combinedParams.current as string,
          ) as number | undefined,
          pageSize: convertToNumberIfPossible(
            combinedParams.pageSize as string,
          ) as number | undefined,
          to: combinedParams.to
            ? decodeURIComponent(combinedParams.to as string)
            : undefined,
        },
      };

      return response;
    }, [pathname, search, params, resource, action]);

    return fn;
  },
}

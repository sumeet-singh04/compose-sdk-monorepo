/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { useEffect, useReducer, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import { type Filter } from '@sisense/sdk-data';
import { withTracking } from '../decorators/hook-decorators';
import { ExecuteQueryParams } from './';
import { queryStateReducer, QueryState } from './query-state-reducer';
import { useSisenseContext } from '../sisense-context/sisense-context';
import { executeQuery } from '../query/execute-query';
import { mergeFilters, mergeFiltersByStrategy } from '../dashboard-widget/utils';
import { FiltersMergeStrategy } from '../dashboard-widget/types';
import { isFiltersChanged } from '../utils/filters-comparator';
import { ClientApplication } from '../app/client-application';
import { extractQueryFromWidget } from './utils';
import { TranslatableError } from '../translation/translatable-error';
import { RestApi } from '../api/rest-api';
import { usePrevious } from '../common/hooks/use-previous';
import { extractDashboardFiltersForWidget } from '../dashboard-widget/translate-dashboard-filters';
import { fetchWidgetDtoModel } from '../dashboard-widget/use-fetch-widget-dto-model';

/**
 * Parameters for {@link useExecuteQueryByWidgetId} hook.
 */
export interface ExecuteQueryByWidgetIdParams {
  /** {@inheritDoc ExecuteQueryByWidgetIdProps.widgetOid} */
  widgetOid: string;

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.dashboardOid} */
  dashboardOid: string;

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.filters} */
  filters?: Filter[];

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.highlights} */
  highlights?: Filter[];

  /** {@inheritDoc ExecuteQueryProps.count} */
  count?: number;

  /** {@inheritDoc ExecuteQueryProps.offset} */
  offset?: number;

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.filtersMergeStrategy} */
  filtersMergeStrategy?: FiltersMergeStrategy;

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.includeDashboardFilters} */
  includeDashboardFilters?: boolean;

  /** {@inheritDoc ExecuteQueryByWidgetIdProps.onBeforeQuery} */
  onBeforeQuery?: (jaql: any) => any | Promise<any>;

  /**
   * Boolean flag to control if query is executed
   *
   * If not specified, the default value is `true`
   */
  enabled?: boolean;
}

export type QueryByWidgetIdState = QueryState & {
  /** Query parameters constructed over the widget */
  query: ExecuteQueryParams | undefined;
};

/**
 * React hook that executes a data query extracted from an existing widget in the Sisense instance.
 *
 * This approach, which offers an alternative to {@link ExecuteQueryByWidgetId} component, is similar to React Query's `useQuery` hook.
 *
 *
 * @example
 * The example below executes a query over the existing dashboard widget with the specified widget and dashboard OIDs.
 ```tsx
  const { data, isLoading, isError } = useExecuteQueryByWidgetId({
    widgetOid: '64473e07dac1920034bce77f',
    dashboardOid: '6441e728dac1920034bce737'
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  if (data) {
    return <div>{`Total Rows: ${data.rows.length}`}</div>;
  }
  return null;
 ```
 * See also hook {@link useExecuteQuery}, which execute a query specified in code.
 * @param params - Parameters to identify the target widget
 * @returns Query state that contains the status of the query execution, the result data, the constructed query parameters, or the error if any occurred
 */
export const useExecuteQueryByWidgetId = withTracking('useExecuteQueryByWidgetId')(
  useExecuteQueryByWidgetIdInternal,
);

/**
 * {@link useExecuteQueryByWidgetId} without tracking to be used inside other hooks or components in Compose SDK.
 * @internal
 */
export function useExecuteQueryByWidgetIdInternal(params: ExecuteQueryByWidgetIdParams) {
  const prevParams = usePrevious(params);
  const { isInitialized, app } = useSisenseContext();
  const [isNeverExecuted, setIsNeverExecuted] = useState(true);
  const query = useRef<QueryByWidgetIdState['query']>(undefined);
  const [queryState, dispatch] = useReducer(queryStateReducer, {
    isLoading: true,
    isError: false,
    isSuccess: false,
    status: 'loading',
    error: undefined,
    data: undefined,
  });

  useEffect(() => {
    if (!isInitialized) {
      dispatch({
        type: 'error',
        error: new TranslatableError('errors.executeQueryNoSisenseContext'),
      });
    }

    if (!app) {
      return;
    }

    if (params?.enabled === false) {
      return;
    }

    if (isNeverExecuted || isParamsChanged(prevParams, params)) {
      const {
        widgetOid,
        dashboardOid,
        filters,
        highlights,
        filtersMergeStrategy,
        count,
        offset,
        includeDashboardFilters,
        onBeforeQuery,
      } = params;

      if (isNeverExecuted) {
        setIsNeverExecuted(false);
      }

      dispatch({ type: 'loading' });

      void executeQueryByWidgetId({
        widgetOid,
        dashboardOid,
        filters,
        highlights,
        filtersMergeStrategy,
        app,
        count,
        offset,
        includeDashboardFilters,
        onBeforeQuery,
      })
        .then(({ data, query: executedQuery }) => {
          query.current = executedQuery;
          dispatch({ type: 'success', data });
        })
        .catch((error: Error) => {
          dispatch({ type: 'error', error });
        });
    }
  }, [params, prevParams, isNeverExecuted, app, isInitialized]);

  return { ...queryState, query: query.current } as QueryByWidgetIdState;
}

/** List of parameters that can be compared by deep comparison */
const simplySerializableParamNames: (keyof ExecuteQueryByWidgetIdParams)[] = [
  'widgetOid',
  'dashboardOid',
  'count',
  'offset',
  'filtersMergeStrategy',
  'includeDashboardFilters',
  'onBeforeQuery',
];

/**
 * Checks if the parameters have changed by deep comparison.
 *
 * @param prevParams - Previous query parameters
 * @param newParams - New query parameters
 */
export function isParamsChanged(
  prevParams: ExecuteQueryByWidgetIdParams | undefined,
  newParams: ExecuteQueryByWidgetIdParams,
) {
  if (!prevParams && newParams) {
    return true;
  }

  const isRegularFiltersChanged = isFiltersChanged(prevParams!.filters, newParams.filters);
  const isHighlightFiltersChanged = isFiltersChanged(prevParams!.highlights, newParams.highlights);

  return (
    simplySerializableParamNames.some(
      (paramName) => !isEqual(prevParams?.[paramName], newParams[paramName]),
    ) ||
    isRegularFiltersChanged ||
    isHighlightFiltersChanged
  );
}

/** @internal */
export async function executeQueryByWidgetId({
  widgetOid,
  dashboardOid,
  filters,
  highlights,
  filtersMergeStrategy,
  count,
  offset,
  includeDashboardFilters,
  app,
  onBeforeQuery,
}: ExecuteQueryByWidgetIdParams & { app: ClientApplication }) {
  const api = new RestApi(app.httpClient);
  const { widget: fetchedWidget, dashboard: fetchedDashboard } = await fetchWidgetDtoModel({
    widgetOid,
    dashboardOid,
    includeDashboard: includeDashboardFilters,
    api,
  });
  const widgetQuery = extractQueryFromWidget(fetchedWidget);
  const { dataSource, dimensions, measures } = widgetQuery;
  let { filters: widgetFilters, highlights: widgetHighlights } = widgetQuery;

  if (includeDashboardFilters) {
    const { filters: dashboardFilters, highlights: dashboardHighlight } =
      extractDashboardFiltersForWidget(fetchedDashboard!, fetchedWidget);
    widgetFilters = mergeFilters(dashboardFilters, widgetFilters);
    widgetHighlights = mergeFilters(dashboardHighlight, widgetHighlights);
  }

  const mergedFilters = mergeFiltersByStrategy(widgetFilters, filters, filtersMergeStrategy);
  const mergedHighlights = mergeFiltersByStrategy(
    widgetHighlights,
    highlights,
    filtersMergeStrategy,
  );

  const executeQueryParams: ExecuteQueryParams = {
    dataSource,
    dimensions,
    measures,
    filters: mergedFilters,
    highlights: mergedHighlights,
    count,
    offset,
  };
  const data = await executeQuery(executeQueryParams, app, { onBeforeQuery });

  return {
    data,
    query: executeQueryParams,
  };
}

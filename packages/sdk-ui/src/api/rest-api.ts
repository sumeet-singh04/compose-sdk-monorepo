import { HttpClient } from '@sisense/sdk-rest-client';
import { useMemo } from 'react';
import { useSisenseContext } from '../sisense-context/sisense-context';
import { WidgetDto } from '../dashboard-widget/types';
import type { DashboardDto } from './types/dashboard-dto';
import { TranslatableError } from '../translation/translatable-error';

type GetDashboardsOptions = {
  searchByTitle?: string;
  fields?: string[];
  expand?: string[];
};

type GetDashboardOptions = {
  fields?: string[];
  expand?: string[];
};

export class RestApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    if (!httpClient) throw new Error('HttpClient not found.');
    this.httpClient = httpClient;
  }

  /**
   * Get all dashboards
   */
  public getDashboards = async (options: GetDashboardsOptions = {}): Promise<DashboardDto[]> => {
    const { fields, expand, searchByTitle } = options;
    const queryParams = new URLSearchParams({
      ...(searchByTitle && { name: searchByTitle }),
      ...(fields?.length && { fields: fields?.join(',') }),
      ...(expand?.length && { expand: expand?.join(',') }),
    }).toString();

    return this.httpClient.get(`api/v1/dashboards?${queryParams}`);
  };

  /**
   * Get a specific dashboard
   */
  public getDashboard = async (
    dashboardOid: string,
    options: GetDashboardOptions = {},
  ): Promise<DashboardDto> => {
    const { fields, expand } = options;
    const queryParams = new URLSearchParams({
      ...(fields?.length && { fields: fields?.join(',') }),
      ...(expand?.length && { expand: expand?.join(',') }),
    }).toString();

    try {
      return await this.httpClient.get(`api/v1/dashboards/${dashboardOid}?${queryParams}`);
    } catch (error) {
      // when error is encountered, API may return only status code 422 without informative error message
      // to remedy, catch error and throw a more informative error message
      throw new TranslatableError('errors.dashboardInvalidIdentifier');
    }
  };

  /**
   * Get a specific widget from a dashboard
   */
  public getWidget = async (widgetOid: string, dashboardOid: string): Promise<WidgetDto> => {
    try {
      return await this.httpClient.get(`api/v1/dashboards/${dashboardOid}/widgets/${widgetOid}`);
    } catch (error) {
      // when error is encountered, API may return only status code 422 without informative error message
      // to remedy, catch error and throw a more informative error message
      throw new TranslatableError('errors.dashboardWidgetInvalidIdentifiers');
    }
  };
}

export const useGetApi = () => {
  const { app } = useSisenseContext();
  return useMemo(() => new RestApi(app!.httpClient), [app]);
};

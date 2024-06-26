import { HttpClient } from '@sisense/sdk-rest-client';
import { RestApi } from '../../api/rest-api';
import { translateDashboard } from './translate-dashboard';
import { type DashboardDto } from '@/api/types/dashboard-dto';
import { type WidgetDto } from '@/dashboard-widget/types';

export interface GetDashboardModelOptions {
  /**
   * Boolean flag whether to include widgets in the dashboard model
   *
   * If not specified, the default value is `false`
   */
  includeWidgets?: boolean;
}

/** @internal */
export async function getDashboardModel(
  http: HttpClient,
  dashboardOid: string,
  options: GetDashboardModelOptions = {},
) {
  const { includeWidgets } = options;
  const api = new RestApi(http);
  const fields = ['oid', 'title', 'datasource'];

  const promises: [Promise<DashboardDto>, Promise<WidgetDto[]>?] = [
    api.getDashboard(dashboardOid, { fields }),
  ];

  if (includeWidgets) {
    promises.push(api.getDashboardWidgets(dashboardOid));
  }

  const [dashboard, widgets] = await Promise.all(promises);

  if (widgets) {
    dashboard.widgets = widgets;
  }

  return translateDashboard(dashboard);
}

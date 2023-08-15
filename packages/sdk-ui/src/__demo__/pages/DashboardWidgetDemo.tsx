import { Filter } from '@sisense/sdk-data';
import { DashboardWidget } from '../../dashboard-widget/DashboardWidget';
import * as DM from '../sample-ecommerce-autogenerated';
import React from 'react';

const widgetOid = window.location.hash?.replace('#', '') || '6423154e48cbdd002900cccc';
const dashboardOid = '642314fe48cbdd002900ccca';

const filters: Filter[] = [];

const drilldownOptions = {
  drilldownCategories: [DM.Commerce.AgeRange, DM.Commerce.Gender, DM.Commerce.Condition],
};

export const DashboardWidgetDemo = () => (
  <div className="h-fit">
    <DashboardWidget
      widgetOid={widgetOid}
      dashboardOid={dashboardOid}
      filters={filters}
      drilldownOptions={drilldownOptions}
    />
  </div>
);

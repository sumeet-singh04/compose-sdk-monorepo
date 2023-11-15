import { Filter, measures, filters, NumericFilter } from '@sisense/sdk-data';
import { ChartWidget } from '../../widgets/chart-widget.js';
import * as DM from '../sample-ecommerce-autogenerated.js';
import { useMemo, useState } from 'react';
import { CriteriaFilterTile } from '../../filters/components/criteria-filter-tile/criteria-filter-tile.js';

export const CriteriaFilterDemo = () => {
  const dataOptions = {
    category: [DM.Category.Category],
    value: [measures.sum(DM.Commerce.Revenue, 'Revenue')],
    breakBy: [],
  };
  const styleOptions = {};
  const drilldownOptions = {
    drilldownDimensions: [DM.Commerce.Quantity, DM.Commerce.Cost, DM.Commerce.Condition],
  };

  const initialFilter = filters.greaterThanOrEqual(DM.Commerce.Revenue, 10000);
  const [categoryFilter, setCategoryFilter] = useState<Filter | null>(initialFilter);
  const appliedFilters = useMemo(() => (categoryFilter ? [categoryFilter] : []), [categoryFilter]);
  return (
    <>
      <CriteriaFilterTile
        title={'Numeric Criteria Filter'}
        filter={appliedFilters[0] as NumericFilter}
        onUpdate={setCategoryFilter}
      />
      <ChartWidget
        dataSource={DM.DataSource}
        chartType={'column'}
        dataOptions={dataOptions}
        filters={appliedFilters}
        drilldownOptions={drilldownOptions}
        styleOptions={styleOptions}
      />
    </>
  );
};

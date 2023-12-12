import {
  Filter,
  measures,
  filters,
  NumericFilter,
  TextFilter,
  RankingFilter,
} from '@sisense/sdk-data';
import { ChartWidget } from '../../widgets/chart-widget.js';
import * as DM from '../sample-ecommerce-autogenerated.js';
import { useMemo, useState } from 'react';
import { CriteriaFilterTile } from '../../filters/components/criteria-filter-tile/criteria-filter-tile.js';

const CriteriaFilterDemoChart1 = () => {
  const dataOptions = {
    category: [DM.Category.Category],
    value: [measures.sum(DM.Commerce.Revenue, 'Revenue')],
    breakBy: [],
  };
  const styleOptions = {};
  const drilldownOptions = {
    drilldownDimensions: [
      DM.Commerce.Quantity,
      DM.Commerce.AgeRange,
      DM.Commerce.Condition,
      DM.Country.Country,
    ],
  };

  const initialRevenueFilter = filters.greaterThanOrEqual(DM.Commerce.Revenue, 10000);
  const [revenueFilter, setRevenueFilter] = useState<Filter | null>(initialRevenueFilter);

  const initialCostFilter = filters.between(DM.Commerce.Cost, 0, 10000);
  const [costFilter, setCostFilter] = useState<Filter | null>(initialCostFilter);

  const initialCategoryFilter = filters.doesntContain(DM.Category.Category, 'Cameras');
  const [categoryFilter, setCategoryFilter] = useState<Filter | null>(initialCategoryFilter);

  const initialCountryFilter = filters.doesntStartWith(DM.Country.Country, 'United');
  const [countryFilter, setCountryFilter] = useState<Filter | null>(initialCountryFilter);

  const appliedFilters = useMemo(() => {
    const filterList = [];
    filterList.push(revenueFilter);
    filterList.push(costFilter);
    filterList.push(categoryFilter);
    filterList.push(countryFilter);
    return filterList;
  }, [categoryFilter, costFilter, countryFilter, revenueFilter]);
  return (
    <>
      <div className={'csdk-flex csdk-gap-1'}>
        <CriteriaFilterTile
          title={'Numeric Criteria: Revenue'}
          filter={appliedFilters?.[0] as NumericFilter}
          onUpdate={setRevenueFilter}
        />
        <CriteriaFilterTile
          title={'Numeric Criteria: Cost'}
          filter={appliedFilters?.[1] as NumericFilter}
          onUpdate={setCostFilter}
        />
        <CriteriaFilterTile
          title={'Text Criteria: Category'}
          filter={appliedFilters?.[2] as TextFilter}
          onUpdate={setCategoryFilter}
        />
        <CriteriaFilterTile
          title={'Text Criteria: Country'}
          filter={appliedFilters?.[3] as TextFilter}
          onUpdate={setCountryFilter}
        />
      </div>
      <ChartWidget
        dataSource={DM.DataSource}
        chartType={'column'}
        dataOptions={dataOptions}
        filters={appliedFilters.filter((f) => f !== null) as Filter[]}
        drilldownOptions={drilldownOptions}
        styleOptions={styleOptions}
      />
    </>
  );
};

const CriteriaFilterDemoChart2 = () => {
  const measureSumRevenue = measures.sum(DM.Commerce.Revenue, 'sum Revenue');
  const measureSumQuantity = measures.sum(DM.Commerce.Quantity, 'sum Quantity');
  const measureAvgQuantity = measures.average(DM.Commerce.Quantity, 'avg Quantity');
  const dataOptions = {
    category: [DM.Category.Category],
    value: [measureSumRevenue],
    breakBy: [],
  };
  const styleOptions = {};
  const drilldownOptions = {
    drilldownDimensions: [
      DM.Commerce.Quantity,
      DM.Commerce.AgeRange,
      DM.Commerce.Condition,
      DM.Country.Country,
    ],
  };

  const initialRankedFilter = filters.topRanking(DM.Category.Category, measureSumQuantity, 5);
  const [rankedFilter, setRankedFilter] = useState<Filter | null>(initialRankedFilter);

  const appliedFilters = useMemo(() => {
    const filterList = [];
    filterList.push(rankedFilter);
    return filterList;
  }, [rankedFilter]);
  return (
    <>
      <div className={'csdk-flex'}>
        <CriteriaFilterTile
          title={'Ranked Criteria: Category by Quantity'}
          filter={appliedFilters?.[0] as RankingFilter}
          onUpdate={setRankedFilter}
          measures={[measureSumQuantity, measureAvgQuantity]}
        />
      </div>
      <ChartWidget
        dataSource={DM.DataSource}
        chartType={'column'}
        dataOptions={dataOptions}
        filters={appliedFilters.filter((f) => f !== null) as Filter[]}
        drilldownOptions={drilldownOptions}
        styleOptions={styleOptions}
      />
    </>
  );
};

export const CriteriaFilterDemo = () => {
  return (
    <>
      <CriteriaFilterDemoChart1 />
      <CriteriaFilterDemoChart2 />
    </>
  );
};
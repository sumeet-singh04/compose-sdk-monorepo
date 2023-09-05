/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { Filter, filters, measures, QueryResultData } from '@sisense/sdk-data';
import * as DM from '../sample-ecommerce-autogenerated';
import { ExecuteQuery } from '../../components/query-execution/ExecuteQuery';
import { DashboardWidget } from '../../dashboard-widget/DashboardWidget';
import React, { useState } from 'react';
import { BasicMemberFilterTile, DateRangeFilterTile } from '../../filters';
import { Table } from '../../components/Table';
import { FunnelChart } from '../../components/FunnelChart';
import { AreaChart } from '../../components/AreaChart';
import { BarChart } from '../../components/BarChart';
import { ColumnChart } from '../../components/ColumnChart';
import { IndicatorChart } from '../../components/IndicatorChart';
import { LineChart } from '../../components/LineChart';
import { PieChart } from '../../components/PieChart';
import { PolarChart } from '../../components/PolarChart';
import { ScatterChart } from '../../components/ScatterChart';
import { ThemeProvider } from '../../components/ThemeProvider';
import { Chart } from '../../components/Chart';

/**
This page is used by Tuan for testing quickly the SDK UI components for API Doc.
Feel free to use it for your own testing.
 */
export const MiscDemo = () => {
  const allMembers = ['United States', 'Canada', 'Mexico'].map((m) => ({ key: m, title: m }));
  const selectedMembers = ['United States', 'Mexico'].map((m) => ({ key: m, title: m }));

  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(
    filters.dateRange(DM.Commerce.Date.Days),
  );
  /* const [{ filter }, setDateRangeFilter] = useState<DateFilterRange>({
    type: 'date-range',
    filter: {
      from: '2019-06-08',
      to: '2019-06-16',
    },
  });*/

  return (
    <div className="csdk-h-fit">
      Chart with No Local Data
      <Chart
        chartType={'pie'}
        dataSet={{ columns: [], rows: [] }}
        dataOptions={{
          category: [
            {
              name: 'Years',
              type: 'date',
            },
          ],
          value: [
            {
              name: 'Quantity',
              aggregation: 'sum',
              title: 'Total Quantity',
            },
          ],
        }}
      />
      <Chart
        dataSet={DM.DataSource}
        chartType={'bar'}
        dataOptions={{
          category: [measures.sum(DM.Commerce.Cost)],
          value: [],
          breakBy: [],
        }}
      />
      <Chart
        dataSet={DM.DataSource}
        chartType={'line'}
        dataOptions={{
          category: [
            {
              column: DM.Commerce.Date.Months,
              dateFormat: 'YYYY-MM-DD',
            },
          ],
          value: [
            measures.sum(DM.Commerce.Revenue),
            {
              column: measures.sum(DM.Commerce.Quantity),
              showOnRightAxis: true,
              chartType: 'column',
            },
          ],
          breakBy: [],
        }}
      />
      <ScatterChart
        dataSet={DM.DataSource}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 10)]}
        dataOptions={{
          x: measures.sum(DM.Commerce.Revenue),
          y: measures.sum(DM.Commerce.Quantity),
          breakByPoint: DM.Category.Category,
          breakByColor: DM.Commerce.Gender,
          size: measures.sum(DM.Commerce.Cost),
        }}
        styleOptions={{
          xAxis: {
            enabled: true,
            gridLines: true,
            isIntervalEnabled: false,
            labels: {
              enabled: true,
            },
            logarithmic: true,
            title: {
              enabled: true,
              text: 'Total Revenue',
            },
          },
          yAxis: {
            enabled: true,
            gridLines: true,
            isIntervalEnabled: false,
            labels: {
              enabled: true,
            },
            logarithmic: true,
            title: {
              enabled: true,
              text: 'Total Quantity',
            },
          },
        }}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <PolarChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.AgeRange],
          value: [measures.sum(DM.Commerce.Revenue)],
          breakBy: [DM.Commerce.Gender],
        }}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <PieChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.AgeRange],
          value: [measures.sum(DM.Commerce.Revenue)],
        }}
        filters={[filters.measureGreaterThanOrEqual(measures.sum(DM.Commerce.Revenue), 1600000)]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <LineChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.Date.Years],
          value: [measures.sum(DM.Commerce.Revenue)],
          breakBy: [DM.Commerce.Gender],
        }}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <IndicatorChart
        dataSet={DM.DataSource}
        dataOptions={{
          value: [measures.sum(DM.Commerce.Revenue)],
        }}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
      />
      <div style={{ width: '400px', height: '400px' }}>
        <ThemeProvider
          theme={{
            chart: {
              backgroundColor: '#333333',
              textColor: 'orange',
              secondaryTextColor: 'purple',
            },
            typography: {
              fontFamily: 'impact',
            },
          }}
        >
          <IndicatorChart
            dataOptions={{
              value: [
                {
                  column: measures.sum(DM.Commerce.Revenue),
                  numberFormatConfig: {
                    name: 'Numbers',
                    decimalScale: 2,
                    trillion: true,
                    billion: true,
                    million: true,
                    kilo: true,
                    thousandSeparator: true,
                    prefix: false,
                    symbol: '$',
                  },
                },
              ],
              secondary: [],
              min: [measures.constant(0)],
              max: [measures.constant(125000000)],
            }}
            filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
            styleOptions={{
              indicatorComponents: {
                title: {
                  shouldBeShown: true,
                  text: 'Total Revenue',
                },
                secondaryTitle: {
                  text: '',
                },
                ticks: {
                  shouldBeShown: true,
                },
                labels: {
                  shouldBeShown: true,
                },
              },
              subtype: 'indicator/gauge',
              skin: 1,
            }}
          />
        </ThemeProvider>
      </div>
      <ColumnChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.AgeRange],
          value: [measures.sum(DM.Commerce.Revenue)],
          breakBy: [DM.Commerce.Gender],
        }}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <BarChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.AgeRange],
          value: [measures.sum(DM.Commerce.Revenue)],
          breakBy: [DM.Commerce.Gender],
        }}
        filters={[filters.greaterThan(DM.Commerce.Revenue, 1000)]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      <AreaChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [DM.Commerce.Date.Years],
          value: [measures.sum(DM.Commerce.Revenue)],
          breakBy: [DM.Commerce.Gender],
        }}
        styleOptions={{ subtype: 'area/stacked' }}
        filters={[filters.members(DM.Commerce.Gender, ['Female', 'Male'])]}
        onDataPointClick={(point, nativeEvent) => {
          console.log('clicked', point, nativeEvent);
        }}
      />
      Copy
      <FunnelChart
        dataSet={{
          columns: [
            { name: 'Stage', type: 'string' },
            { name: 'Unique Users', type: 'number' },
          ],
          rows: [
            ['Website visits', 15654],
            ['Downloads', 4064],
            ['Requested price list', 1987],
            ['Invoice sent', 976],
            ['Finalized', 846],
          ],
        }}
        dataOptions={{
          category: [
            {
              name: 'Stage',
              type: 'string',
            },
          ],
          value: [
            {
              name: 'Unique Users',
              aggregation: 'sum',
            },
          ],
        }}
      />
      <DateRangeFilterTile
        title="Date Range"
        attribute={DM.Commerce.Date.Days}
        filter={dateRangeFilter}
        onChange={(filter: Filter) => {
          setDateRangeFilter(filter);
        }}
      />
      ExecuteQuery
      <ExecuteQuery
        dimensions={[DM.Commerce.Date.Days]}
        measures={[measures.sum(DM.Commerce.Revenue)]}
        filters={[dateRangeFilter, filters.greaterThan(DM.Commerce.Revenue, 1000)]}
      >
        {(data: QueryResultData) => {
          return <div>{`Total Rows: ${data?.rows.length}`}</div>;
        }}
      </ExecuteQuery>
      DashboardWidget
      <DashboardWidget
        widgetOid={'64473e07dac1920034bce77f'}
        dashboardOid={'6441e728dac1920034bce737'}
      />
      <BasicMemberFilterTile
        title={'Country'}
        allMembers={allMembers}
        initialSelectedMembers={selectedMembers}
      />
      <Table
        dataSet={DM.DataSource}
        dataOptions={{
          columns: [
            DM.Commerce.AgeRange,
            DM.Commerce.Revenue,
            DM.Commerce.Cost,
            DM.Commerce.Quantity,
          ],
        }}
        styleOptions={{
          width: 600,
          height: 750,
          headersColor: false,
          alternatingColumnsColor: false,
          alternatingRowsColor: true,
        }}
      />
    </div>
  );
};

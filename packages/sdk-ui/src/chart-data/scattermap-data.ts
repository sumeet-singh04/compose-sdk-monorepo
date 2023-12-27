import { ScattermapChartDataOptionsInternal } from '../chart-data-options/types.js';
import {
  Column,
  DataTable,
  getColumnByName,
  getColumnsByName,
  getValue,
  isBlurred,
} from '../chart-data-processor/table-processor.js';
import { combineLocationNames } from '../charts/scattermap/utils/location.js';
import { ScattermapChartData } from './types.js';

const DATA_VALUE_N_A = 'N\\A';
const LOCATION_DEFAULT_VALUE = 1;

export const scattermapData = (
  chartDataOptions: ScattermapChartDataOptionsInternal,
  dataTable: DataTable,
): ScattermapChartData => {
  const locationColumns: Column[] =
    chartDataOptions.locations &&
    getColumnsByName(
      dataTable,
      chartDataOptions.locations.map(({ name }) => name),
    );
  const sizeColumn =
    chartDataOptions.size && getColumnByName(dataTable, chartDataOptions.size.name);
  const colorByColumn =
    chartDataOptions.colorBy && getColumnByName(dataTable, chartDataOptions.colorBy.name);
  const detailsColumn =
    chartDataOptions.details && getColumnByName(dataTable, chartDataOptions.details.name);

  const locations = dataTable.rows
    .filter((row) => {
      return locationColumns.some((column) => (getValue(row, column) as string) !== DATA_VALUE_N_A);
    })
    .map((row) => {
      const name = combineLocationNames(
        locationColumns.map((column) => getValue(row, column) as string),
      );
      const blur = locationColumns[0] && isBlurred(row, locationColumns[0]);
      return {
        name,
        value: sizeColumn ? (getValue(row, sizeColumn) as number) : LOCATION_DEFAULT_VALUE,
        ...(colorByColumn && { colorValue: getValue(row, colorByColumn) as number }),
        ...(detailsColumn && { details: getValue(row, detailsColumn) as number }),
        blur,
      };
    });

  return {
    type: 'scattermap',
    locations,
  };
};

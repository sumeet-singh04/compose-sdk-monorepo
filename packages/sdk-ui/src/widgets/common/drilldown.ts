/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCallback, useMemo, useState } from 'react';

import {
  ChartDataOptions,
  ChartDataPoint,
  DataPoint,
  DrilldownOptions,
  DrilldownSelection,
} from '../../types';
import { Attribute, MembersFilter, filterFactory } from '@sisense/sdk-data';
import { translateColumnToAttribure } from '../../chart-data-options/utils';

export const useDrilldown = (
  dataOptions: ChartDataOptions,
  drilldownOptions?: DrilldownOptions,
) => {
  const { drilldownDimensions = [], drilldownSelections: initialSelections = [] } =
    drilldownOptions ?? {};

  const [drilldownSelections, setDrilldownSelections] = useState(initialSelections);

  const availableDrilldowns = useMemo(
    () =>
      drilldownDimensions.filter(({ expression }) =>
        drilldownSelections.every(({ nextDimension }) => nextDimension.expression !== expression),
      ),
    [drilldownDimensions, drilldownSelections],
  );

  const selectDrilldown = useCallback(
    (points: DataPoint[], nextDimension: Attribute) => {
      setDrilldownSelections((state) => [...state, { points, nextDimension }]);
    },
    [setDrilldownSelections],
  );

  const sliceDrilldownSelections = useCallback(
    (i: number) => {
      setDrilldownSelections((state) => state.slice(0, i));
    },
    [setDrilldownSelections],
  );

  const clearDrilldownSelections = useCallback(() => {
    setDrilldownSelections([]);
  }, [setDrilldownSelections]);

  const drilldownProps = useMemo(
    () => processDrilldownSelections(dataOptions, drilldownSelections),
    [dataOptions, drilldownSelections],
  );

  return {
    selectDrilldown,
    sliceDrilldownSelections,
    clearDrilldownSelections,
    drilldownSelections,
    availableDrilldowns,
    ...drilldownProps,
  };
};

const processDrilldownSelections = (
  dataOptions: ChartDataOptions,
  drilldownSelections: DrilldownSelection[],
) => {
  if (!('category' in dataOptions) || !dataOptions.category[0]) {
    return {
      drilldownFilters: [],
      drilldownFiltersDisplayValues: [],
      drilldownDimension: undefined,
      dataOptionsWithDrilldown: dataOptions,
    };
  }

  const [firstCategory, ...otherCategories] = dataOptions.category;
  let currentDimension = firstCategory;
  const drilldownFilters: MembersFilter[] = [];
  const drilldownFiltersDisplayValues: string[][] = [];

  drilldownSelections.forEach(({ points, nextDimension }) => {
    drilldownFilters.push(
      filterFactory.members(
        translateColumnToAttribure(currentDimension),
        points.map(getMemberNameFromDataPoint),
      ) as MembersFilter,
    );
    drilldownFiltersDisplayValues.push(points.map(getDisplayMemberNameFromDataPoint));
    currentDimension = nextDimension;
  });

  return {
    drilldownFilters,
    drilldownFiltersDisplayValues,
    drilldownDimension: translateColumnToAttribure(currentDimension),
    dataOptionsWithDrilldown: {
      ...dataOptions,
      category: [currentDimension, ...otherCategories],
    } as ChartDataOptions,
  };
};

export function getMemberNameFromDataPoint(point: ChartDataPoint) {
  // only DataPoint is currently supported for drilldown
  if ('categoryValue' in point) {
    return `${point.categoryValue}`;
  } else {
    return '';
  }
}

export function getDisplayMemberNameFromDataPoint(point: ChartDataPoint) {
  // only DataPoint is currently supported for drilldown
  if ('categoryDisplayValue' in point) {
    return `${point.categoryDisplayValue}`;
  } else if ('categoryValue' in point) {
    return `${point.categoryValue}`;
  } else {
    return '';
  }
}

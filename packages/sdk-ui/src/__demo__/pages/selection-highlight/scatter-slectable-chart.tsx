/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { MembersFilter, measures } from '@sisense/sdk-data';
import { ChartWidget } from '../../../widgets/chart-widget';
import * as DM from '../../sample-ecommerce-autogenerated';
import { ScatterDataPoint } from 'packages/sdk-ui/src/types';
import { useCallback, useEffect, useState } from 'react';

export const ScatterSelectableChart = ({
  onPointsSelect,
  filters,
}: {
  onPointsSelect: (filters: MembersFilter[]) => void;
  filters: MembersFilter[];
}) => {
  const [selectedPoints, setSelectedPoints] = useState<ScatterDataPoint[]>([]);

  const dataOptions = {
    x: measures.sum(DM.Commerce.Revenue),
    y: measures.sum(DM.Commerce.Quantity),
    breakByPoint: DM.Commerce.AgeRange,
    breakByColor: DM.Commerce.Gender,
    size: measures.sum(DM.Commerce.Cost),
  };

  const getSelectionFilters = useCallback(() => {
    const categoryMap = selectedPoints.reduce(
      (acc, { breakByColor, breakByPoint }) => {
        if (breakByColor) acc.breakByColor.push(breakByColor);
        if (breakByPoint) acc.breakByPoint.push(breakByPoint);
        return {
          breakByColor: [...new Set(acc.breakByColor)],
          breakByPoint: [...new Set(acc.breakByPoint)],
        };
      },
      { breakByColor: [] as string[], breakByPoint: [] as string[] },
    );
    return [
      new MembersFilter(dataOptions.breakByColor, categoryMap.breakByColor),
      new MembersFilter(dataOptions.breakByPoint, categoryMap.breakByPoint),
    ];
  }, [dataOptions.breakByColor, dataOptions.breakByPoint, selectedPoints]);

  useEffect(() => {
    const filters = getSelectionFilters();
    onPointsSelect(filters);
  }, [selectedPoints, getSelectionFilters, onPointsSelect]);

  return (
    <>
      <div className="csdk-m-2">
        <h3>Scatter Selectable Chart</h3>
        <ChartWidget
          styleOptions={{
            height: 400,
            width: 600,
          }}
          highlightSelectionDisabled={true}
          widgetStyleOptions={{
            border: true,
            borderColor: 'lightgrey',
            cornerRadius: 'Medium',
          }}
          filters={filters}
          chartType={'scatter'}
          dataOptions={dataOptions}
          onDataPointsSelected={setSelectedPoints}
          onDataPointClick={(dataPoint: ScatterDataPoint) => setSelectedPoints([dataPoint])}
        />
      </div>
    </>
  );
};
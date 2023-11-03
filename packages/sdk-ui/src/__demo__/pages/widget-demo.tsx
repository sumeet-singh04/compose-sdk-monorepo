import { measures as measureFactory } from '@sisense/sdk-data';
import { ChartWidget } from '../../widgets/chart-widget';
import * as DM from '../sample-ecommerce-autogenerated';
import { DataPoint } from '../../types';
import { DrilldownWidget } from '../../widgets/drilldown-widget';
import { DataPointEventHandler } from '../../props';

const dataOptions = {
  category: [DM.Category.Category],
  value: [measureFactory.sum(DM.Commerce.Revenue)],
  breakBy: [],
};
const styleOptions = {};

const drilldownOptions = {
  drilldownDimensions: [DM.Commerce.AgeRange, DM.Commerce.Gender, DM.Commerce.Condition],
};

export const WidgetDemo = () => (
  <div className="csdk-h-fit">
    <DrilldownWidget
      initialDimension={dataOptions.category[0]}
      drilldownDimensions={drilldownOptions.drilldownDimensions}
    >
      {({ drilldownDimension, drilldownFilters, onDataPointsSelected, onContextMenu }) => (
        <ChartWidget
          chartType="bar"
          title="With Drilldown"
          filters={drilldownFilters}
          dataOptions={{ ...dataOptions, category: [drilldownDimension] }}
          styleOptions={styleOptions}
          highlightSelectionDisabled={true}
          onDataPointsSelected={(dataPoints: DataPoint[], event: MouseEvent) => {
            onDataPointsSelected(dataPoints, event);
            onContextMenu({ left: event.clientX, top: event.clientY });
          }}
          onDataPointClick={(dataPoint: DataPoint, event: PointerEvent) => {
            onDataPointsSelected([dataPoint], event);
            onContextMenu({ left: event.clientX, top: event.clientY });
          }}
          onDataPointContextMenu={
            ((dataPoint, event) => {
              onDataPointsSelected([dataPoint], event);
              onContextMenu({ left: event.clientX, top: event.clientY });
            }) as DataPointEventHandler
          }
        />
      )}
    </DrilldownWidget>
    <ChartWidget
      title="Without Drilldown"
      chartType="bar"
      dataOptions={dataOptions}
      styleOptions={styleOptions}
      onDataPointsSelected={(dataPoints: DataPoint[]) => {
        console.log(dataPoints);
      }}
    />
  </div>
);

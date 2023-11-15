/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
import { useCallback, useMemo, useState, type FunctionComponent } from 'react';

import { Chart } from '../chart';
import { DataPoint, CartesianChartDataOptions, ScatterDataPoint, DataPoints } from '../types';
import { ChartWidgetProps } from '../props';
import { WidgetHeader } from './common/widget-header';
import { ThemeProvider, useThemeContext } from '../theme-provider';
import { WidgetCornerRadius, WidgetSpaceAround, getShadowValue } from './common/widget-style-utils';
import { asSisenseComponent } from '../decorators/component-decorators/as-sisense-component';
import { DynamicSizeContainer, getWidgetDefaultSize } from '../dynamic-size-container';
import {
  HighchartsOptions,
  HighchartsOptionsInternal,
} from '../chart-options-processor/chart-options-service';
import { isCartesian } from '../chart-options-processor/translations/types';
import { ChartWidgetDeprecated } from './chart-widget-deprecated';

/**
 * The Chart Widget component extending the {@link Chart} component to support widget style options.
 * It can be used along with the {@link DrilldownWidget} component to support advanced data drilldown.
 *
 * @example
 * Example of using the `ChartWidget` component to
 * plot a bar chart of the `Sample ECommerce` data source hosted in a Sisense instance.
 * ```tsx
 * <ChartWidget
 *   dataSource={DM.DataSource}
 *   chartType="bar"
 *   dataOptions={{
 *     category: [DM.Category.Category],
 *     value: [measures.sum(DM.Commerce.Revenue)],
 *     breakBy: [],
 *   }}
 * />
 * ```
 *
 * <img src="media://chart-widget-with-drilldown-example-1.png" width="800px" />
 * @param props - ChartWidget properties
 * @returns ChartWidget component representing a chart type as specified in `ChartWidgetProps.`{@link ChartWidgetProps.chartType | chartType}
 */
export const ChartWidget: FunctionComponent<ChartWidgetProps> = asSisenseComponent({
  componentName: 'ChartWidget',
})((props) => {
  const { chartType, drilldownOptions, highlightSelectionDisabled = false } = props;

  // TODO: remove this once drilldownOptions are removed from ChartWidgetProps
  if (drilldownOptions) {
    console.warn(
      'drilldownOptions in ChartWidget are deprecated, please use DrilldownWidget instead',
    );
    return <ChartWidgetDeprecated {...props} />;
  }

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedDataPoints, setSelectedDataPoints] = useState<DataPoints>([]);

  const { themeSettings } = useThemeContext();

  const isCartesianChart = useMemo(() => isCartesian(chartType), [chartType]);
  const isScatterChart = useMemo(() => chartType === 'scatter', [chartType]);
  const isDrilldownEnabled = useMemo(() => !!drilldownOptions, [drilldownOptions]);

  const isSelectionAllowed = useMemo(
    () =>
      !highlightSelectionDisabled &&
      !isDrilldownEnabled &&
      ((isCartesianChart &&
        (props.dataOptions as CartesianChartDataOptions).category?.length === 1) ||
        isScatterChart),
    [
      isDrilldownEnabled,
      props.dataOptions,
      isCartesianChart,
      isScatterChart,
      highlightSelectionDisabled,
    ],
  );

  const {
    dataSource,
    topSlot,
    bottomSlot,
    title,
    description,
    widgetStyleOptions,
    styleOptions,
    dataOptions,
    onDataPointsSelected: originalOnDataPointsSelected,
    onDataPointClick: originalOnDataPointClick,
    onBeforeRender: originalOnBeforeRender,
    ...restProps
  } = props;

  const applyPointSelections = useMemo(() => {
    if (selectedDataPoints.length === 0) {
      return (options: HighchartsOptionsInternal) =>
        ({
          ...options,
          series: options.series.map((s) => ({
            ...s,
            data: s.data.map((d) => ({ ...d, selected: false })),
          })),
        } as HighchartsOptions);
    }
    if (isScatterChart) {
      return (options: HighchartsOptionsInternal) =>
        ({
          ...options,
          series: options.series.map((s) => ({
            ...s,
            data: s.data.map((d) => {
              return {
                ...d,
                selected: !(selectedDataPoints as ScatterDataPoint[]).some(
                  (point) =>
                    point.x === d.x &&
                    point.y === d.y &&
                    point.size === d.z &&
                    point.breakByPoint === d.custom?.maskedBreakByPoint &&
                    point.breakByColor === d.custom?.maskedBreakByColor,
                ),
              };
            }),
          })),
        } as HighchartsOptions);
    } else {
      const categoryValueMap = (selectedDataPoints as DataPoint[]).reduce(
        (accu, { categoryValue }) => {
          if (categoryValue) {
            accu[`${categoryValue}`] = true;
          }
          return accu;
        },
        {},
      );

      return (options: HighchartsOptionsInternal) => ({
        ...options,
        series: options.series.map((s) => ({
          ...s,
          data: s.data.map((d) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            categoryValueMap[d.custom?.xValue?.[0]] ? d : { ...d, selected: true },
          ),
        })),
      });
    }
  }, [selectedDataPoints, isScatterChart]);

  const setOnClickOutside = useMemo(
    () => (options: HighchartsOptions) =>
      ({
        ...options,
        chart: {
          ...options.chart,
          events: {
            ...options.chart?.events,
            click: () => {
              setSelectedDataPoints([]);
            },
          },
        },
      } as HighchartsOptions),
    [],
  );

  const onBeforeRender = useCallback(
    (options: HighchartsOptions) => {
      if (isSelectionAllowed) {
        options = applyPointSelections(options as HighchartsOptionsInternal) as HighchartsOptions;
        options = setOnClickOutside(options);
      }
      options = originalOnBeforeRender?.(options) ?? options;
      return options;
    },
    [originalOnBeforeRender, applyPointSelections, setOnClickOutside, isSelectionAllowed],
  );

  const onDataPointsSelected = useCallback(
    (dataPoints: DataPoints, event: MouseEvent): void => {
      if (isSelectionAllowed) {
        setSelectedDataPoints(dataPoints);
      }
      originalOnDataPointsSelected?.(dataPoints, event);
    },
    [isSelectionAllowed, originalOnDataPointsSelected],
  );

  const onDataPointClick = useCallback(
    (dataPoint: DataPoint | ScatterDataPoint, event: PointerEvent) => {
      if (isSelectionAllowed) {
        setSelectedDataPoints([dataPoint] as DataPoints);
      }
      originalOnDataPointClick?.(dataPoint, event);
    },
    [isSelectionAllowed, originalOnDataPointClick],
  );

  const defaultSize = getWidgetDefaultSize(chartType, {
    hasHeader: !widgetStyleOptions?.header?.hidden,
  });
  const { width, height, ...styleOptionsWithoutSizing } = styleOptions || {};

  const chartProps = {
    ...restProps,
    chartType,
    dataOptions,
    dataSet: dataSource,
    styleOptions: styleOptionsWithoutSizing,
    onBeforeRender,
    onDataPointClick,
    onDataPointsSelected,
  };

  if (!chartType || !dataOptions) {
    return null;
  }

  return (
    <DynamicSizeContainer
      defaultSize={defaultSize}
      size={{
        width,
        height,
      }}
    >
      <div className={'csdk-w-full csdk-h-full csdk-overflow-hidden'}>
        <div
          className={'csdk-h-full'}
          style={{
            padding: WidgetSpaceAround[widgetStyleOptions?.spaceAround || 'None'],
          }}
        >
          <div
            className={'csdk-h-full csdk-overflow-hidden'}
            style={{
              borderWidth: widgetStyleOptions?.border ? '1px' : 0,
              borderColor: widgetStyleOptions?.borderColor || themeSettings.chart.textColor,
              borderRadius: widgetStyleOptions?.cornerRadius
                ? WidgetCornerRadius[widgetStyleOptions.cornerRadius]
                : 0,
              boxShadow: getShadowValue(widgetStyleOptions),
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {!widgetStyleOptions?.header?.hidden && (
              <WidgetHeader
                title={title}
                description={description}
                dataSetName={chartProps.dataSet}
                styleOptions={widgetStyleOptions?.header}
                onRefresh={() => setRefreshCounter(refreshCounter + 1)}
              />
            )}
            {topSlot}
            <ThemeProvider
              theme={{
                chart: {
                  backgroundColor:
                    widgetStyleOptions?.backgroundColor || themeSettings.chart?.backgroundColor,
                },
              }}
            >
              <div
                style={{
                  flexGrow: 1,
                  // prevents 'auto' behavior of using content size as minimal size for container
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <Chart {...chartProps} refreshCounter={refreshCounter} />
              </div>
            </ThemeProvider>

            {bottomSlot}
          </div>
        </div>
      </div>
    </DynamicSizeContainer>
  );
});

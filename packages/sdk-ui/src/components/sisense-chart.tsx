/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo } from 'react';
import { ChartDataOptionsInternal } from '../chart-data-options/types';
import { ChartData } from '../chart-data/types';
import {
  applyEventHandlersToChart,
  DataPointEventHandler,
  DataPointsEventHandler,
  ScatterDataPointEventHandler,
  ScatterDataPointsEventHandler,
} from '../chart-options-processor/apply-event-handlers';
import { BeforeRenderHandler } from '../props';
import {
  HighchartsOptionsInternal,
  highchartsOptionsService,
  HighchartsOptions,
} from '../chart-options-processor/chart-options-service';
import { applyThemeToChart } from '../chart-options-processor/theme-option-service';
import { applyCommonHighchartsOptions } from '../chart-options-processor/common-highcharts-option-service';
import { ChartDesignOptions } from '../chart-options-processor/translations/types';
import { ChartType, CompleteThemeSettings } from '../types';
import { HighchartsWrapper } from './highcharts-wrapper';
import { useSisenseContext } from './sisense-context/sisense-context';
import { applyDateFormat } from '../query/date-formats';
import AlertBox from './alert-box/alert-box';

interface Props {
  chartType: ChartType;
  chartData: ChartData;
  chartDataOptions: ChartDataOptionsInternal;
  designOptions: ChartDesignOptions;
  themeSettings?: CompleteThemeSettings;
  onDataPointClick?: DataPointEventHandler | ScatterDataPointEventHandler;
  onDataPointContextMenu?: DataPointEventHandler | ScatterDataPointEventHandler;
  onDataPointsSelected?: DataPointsEventHandler | ScatterDataPointsEventHandler;
  onBeforeRender?: BeforeRenderHandler;
}

/**
 * @internal
 */
export const SisenseChart = ({
  chartType,
  chartData,
  chartDataOptions,
  designOptions,
  themeSettings,
  onDataPointClick,
  onDataPointContextMenu,
  onDataPointsSelected,
  onBeforeRender = (options) => options,
}: Props) => {
  const { app } = useSisenseContext();

  const alerts: string[] = [];

  const dateFormatter = useCallback(
    (date: Date, format: string) =>
      applyDateFormat(date, format, app?.settings.locale, app?.settings.dateConfig),
    [],
  );

  const options = useMemo((): HighchartsOptionsInternal | null => {
    const { options: highchartsOptions, alerts: highchartsOptionsAlerts } =
      highchartsOptionsService(
        chartData,
        chartType,
        designOptions,
        chartDataOptions,
        themeSettings,
        dateFormatter,
      );
    alerts.push(...highchartsOptionsAlerts);

    const highchartsOptionsWithCommonOptions = applyCommonHighchartsOptions(highchartsOptions);

    const highchartsOptionsWithEventHandlers = applyEventHandlersToChart(
      highchartsOptionsWithCommonOptions,
      {
        onDataPointClick,
        onDataPointContextMenu,
        onDataPointsSelected,
      },
    );

    const highchartsThemedOptions = applyThemeToChart(
      highchartsOptionsWithEventHandlers,
      themeSettings,
    );
    return onBeforeRender(
      highchartsThemedOptions as HighchartsOptions,
    ) as HighchartsOptionsInternal;
  }, [
    chartData,
    chartDataOptions,
    designOptions,
    themeSettings,
    onDataPointClick,
    onDataPointContextMenu,
    onBeforeRender,
  ]);

  return (
    options && (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {!!alerts.length && <AlertBox alerts={alerts} />}
        <HighchartsWrapper options={options} />
      </div>
    )
  );
};
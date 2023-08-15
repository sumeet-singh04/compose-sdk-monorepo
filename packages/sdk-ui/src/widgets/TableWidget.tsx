/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, type FunctionComponent } from 'react';

import { ThemeSettings } from '../types';
import { TableWidgetProps } from '../props';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { WidgetHeader } from './common/WidgetHeader';
import { ThemeProvider, useThemeContext } from '../components/ThemeProvider';
import { WidgetCornerRadius, WidgetSpaceAround, getShadowValue } from './common/widgetStyleUtils';
import { Table } from '../components/Table';
import { useRef } from 'react';
import { useEffect } from 'react';

/**
 * @internal
 */
export const UnwrappedTableWidget: FunctionComponent<TableWidgetProps> = (props) => {
  const tableWrapper = useRef<null | HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState<null | number>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { topSlot, bottomSlot, title, description, widgetStyleOptions } = props;

  const { themeSettings } = useThemeContext();

  useEffect(() => {
    if (tableWrapper.current) {
      setTableWidth(tableWrapper.current.offsetWidth);
    }
  }, []);

  if (!props.dataOptions) {
    return null;
  }

  return (
    <div className={'w-full h-full overflow-hidden'}>
      <div
        style={{
          padding: WidgetSpaceAround[widgetStyleOptions?.spaceAround || 'None'],
        }}
      >
        <div
          className="overflow-hidden"
          style={{
            borderWidth: widgetStyleOptions?.border ? '1px' : 0,
            borderColor: widgetStyleOptions?.borderColor || themeSettings.chart.textColor,
            borderRadius: widgetStyleOptions?.cornerRadius
              ? WidgetCornerRadius[widgetStyleOptions.cornerRadius]
              : 0,
            boxShadow: getShadowValue(widgetStyleOptions),
          }}
        >
          {!widgetStyleOptions?.header?.hidden && (
            <WidgetHeader
              title={title}
              description={description}
              dataSetName={props.dataSource}
              styleOptions={widgetStyleOptions?.header}
              onRefresh={() => setRefreshCounter(refreshCounter + 1)}
            />
          )}
          {topSlot}

          <ThemeProvider
            theme={
              {
                chart: {
                  backgroundColor:
                    widgetStyleOptions?.backgroundColor || themeSettings.chart?.backgroundColor,
                },
              } as ThemeSettings
            }
          >
            <div ref={tableWrapper} style={{ height: '100%' }}>
              <Table
                dataSet={props.dataSource}
                dataOptions={props.dataOptions}
                styleOptions={{
                  ...(tableWidth ? { width: tableWidth } : null),
                  ...props.styleOptions,
                }}
                filters={props.filters}
              />
            </div>
          </ThemeProvider>

          {bottomSlot}
        </div>
      </div>
    </div>
  );
};

/**
 * The TableWidget component extending the {@link Table} component to support advanced BI
 * capabilities such as header.
 *
 * @example
 * Example of using the `Widget` component to
 * plot a bar chart of the `Sample ECommerce` data source hosted in a Sisense instance.
 * Drill-down capability is enabled.
 * ```tsx
 * <TableWidget
 *   dataSource={DM.DataSource}
 *   dataOptions={{
 *     columns: [DM.Category.Category]
 *   }}
 * />
 * ```
 * ###
 * @param props - Table Widget properties
 * @returns Widget component representing a table
 * @internal
 */
export const TableWidget: FunctionComponent<TableWidgetProps> = (props) => {
  return (
    <ErrorBoundary>
      <UnwrappedTableWidget {...props} />
    </ErrorBoundary>
  );
};

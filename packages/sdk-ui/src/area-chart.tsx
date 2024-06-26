import { AreaChartProps } from './props';
import { Chart, shouldSkipSisenseContextWaiting } from './chart';
import { asSisenseComponent } from './decorators/component-decorators/as-sisense-component';
/**
 * A React component similar to a {@link LineChart},
 * but with filled in areas under each line and an option to display them as stacked.
 *
 * ## Example
 *
 * Area chart displaying total revenue per quarter from the Sample ECommerce data model.
 *
 * <iframe
 *  src='https://dhoavm6pu1cvg.cloudfront.net/?example=charts%2Farea-chart&mode=docs'
 *  width=800
 *  height=870
 *  style='border:none;'
 * />
 *
 * Additional Area Chart examples:
 *
 * - [Stacked Area Chart](https://csdk-playground.sisense.com/?example=charts%2Farea-chart-stacked)
 * - [Stacked Percentage Area Chart](https://csdk-playground.sisense.com/?example=charts%2Farea-chart-stacked100)
 *
 * @param props - Area chart properties
 * @returns Area Chart component
 * @group Charts
 */
export const AreaChart = asSisenseComponent({
  componentName: 'AreaChart',
  shouldSkipSisenseContextWaiting,
})((props: AreaChartProps) => {
  return <Chart {...props} chartType="area" />;
});

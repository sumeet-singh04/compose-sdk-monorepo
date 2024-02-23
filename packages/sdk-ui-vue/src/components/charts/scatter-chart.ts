import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { ScatterChart as ScatterChartPreact } from '@sisense/sdk-ui-preact';
import type { ScatterChartProps } from '@sisense/sdk-ui-preact';
import { setupHelper } from '../../setup-helper';

/**
 * A Vue component displaying the distribution of two variables on an X-Axis, Y-Axis,
 * and two additional fields of data that are shown as colored circles scattered across the chart.
 *
 * **Point**: A field that for each of its members a scatter point is drawn. The maximum amount of data points is 500.
 *
 * **Size**: An optional field represented by the size of the circles.
 * If omitted, all scatter points are equal in size. If used, the circle sizes are relative to their values.
 *
 * See [Scatter Chart](https://docs.sisense.com/main/SisenseLinux/scatter-chart.htm) for more information.
 *
 * @example
 * Here's how you can use the ScatterChart component in a Vue application:
 * ```vue
 * <template>
      <ScatterChart
        :dataOptions="scatterChartProps.dataOptions"
        :dataSet="scatterChartProps.dataSet"
        :filters="scatterChartProps.filters"
      />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import {ScatterChart, type ScatterChartProps} from '@sisense/sdk-ui-vue';
 *
const scatterChartProps = ref<ScatterChartProps>({
  dataSet: DM.DataSource,
  dataOptions: {
    x: dimProductName,
    y: measureTotalRevenue,
  },
  filters: [filterFactory.topRanking(dimProductName, measureTotalRevenue, 10)],
});
 * ```
 * <img src="media://scatter-chart-example-1.png" width="800px" />
 * @param props - Scatter chart properties
 * @returns Scatter Chart component
 */
export const ScatterChart = defineComponent({
  props: {
    dataOptions: Object as PropType<ScatterChartProps['dataOptions']>,
    dataSet: Object as PropType<ScatterChartProps['dataSet']>,
    filters: Object as PropType<ScatterChartProps['filters']>,
    highlights: Object as PropType<ScatterChartProps['highlights']>,
    onBeforeRender: Function as PropType<ScatterChartProps['onBeforeRender']>,
    onDataPointClick: Function as PropType<ScatterChartProps['onDataPointClick']>,
    onDataPointContextMenu: Function as PropType<ScatterChartProps['onDataPointContextMenu']>,
    onDataPointsSelected: Function as PropType<ScatterChartProps['onDataPointsSelected']>,
    styleOptions: Object as PropType<ScatterChartProps['styleOptions']>,
  },
  setup: (props) => setupHelper(ScatterChartPreact, props),
});
---
title: PolarChart
---

# Class PolarChart

A Vue component comparing multiple categories/variables with a spacial perspective in a radial chart.
See [Polar Chart](https://docs.sisense.com/main/SisenseLinux/polar-chart.htm) for more information.

## Example

Here's how you can use the PolarChart component in a Vue application:
```vue
<template>
     <PolarChart
       :dataOptions="polarChartProps.dataOptions"
       :dataSet="polarChartProps.dataSet"
       :filters="polarChartProps.filters"
     />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {PolarChart,type PolarChartProps} from '@sisense/sdk-ui-vue';

const polarChartProps = ref<PolarChartProps>({
 dataSet: DM.DataSource,
 dataOptions: {
   category: [dimProductName],
   value: [{ column: measureTotalRevenue, sortType: 'sortDesc' }],
   breakBy: [],
 },
 filters: [filterFactory.topRanking(dimProductName, measureTotalRevenue, 10)],
});
```
<img src="../../../img/polar-chart-example-1.png" width="600px" />

## Param

Polar chart properties

## Properties

### dataOptions

> **dataOptions**?: [`CartesianChartDataOptions`](../interfaces/interface.CartesianChartDataOptions.md)

***

### dataSet

> **dataSet**?: `string` \| [`Data`](../../sdk-data/interfaces/interface.Data.md)

***

### filters

> **filters**?: [`Filter`](../../sdk-data/interfaces/interface.Filter.md)[] \| [`FilterRelations`](../../sdk-data/interfaces/interface.FilterRelations.md)

***

### highlights

> **highlights**?: [`Filter`](../../sdk-data/interfaces/interface.Filter.md)[]

***

### onBeforeRender

> **onBeforeRender**?: [`BeforeRenderHandler`](../type-aliases/type-alias.BeforeRenderHandler.md)

***

### onDataPointClick

> **onDataPointClick**?: [`DataPointEventHandler`](../../sdk-ui/type-aliases/type-alias.DataPointEventHandler.md)

***

### onDataPointContextMenu

> **onDataPointContextMenu**?: [`DataPointEventHandler`](../../sdk-ui/type-aliases/type-alias.DataPointEventHandler.md)

***

### onDataPointsSelected

> **onDataPointsSelected**?: [`DataPointsEventHandler`](../../sdk-ui/type-aliases/type-alias.DataPointsEventHandler.md)

***

### styleOptions

> **styleOptions**?: [`PolarStyleOptions`](../interfaces/interface.PolarStyleOptions.md)
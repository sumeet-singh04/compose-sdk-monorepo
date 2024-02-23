---
title: ColumnChart
---

# Class ColumnChart

A Vue component representing categorical data with vertical rectangular bars
whose heights are proportional to the values that they represent.
See [Column Chart](https://docs.sisense.com/main/SisenseLinux/column-chart.htm) for more information.

## Example

Here's how you can use the ColumnChart component in a Vue application:
```vue
<template>
     <ColumnChart
       :dataOptions="columnChartProps.dataOptions"
       :dataSet="columnChartProps.dataSet"
       :filters="columnChartProps.filters"
     />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {ColumnChart, type ColumnChartProps} from '@sisense/sdk-ui-vue';

const columnChartProps = ref<ColumnChartProps>({
 dataSet: DM.DataSource,
 dataOptions: {
   category: [dimProductName],
   value: [{ column: measureTotalRevenue, sortType: 'sortDesc' }],
   breakBy: [],
 },
 filters: [filterFactory.topRanking(dimProductName, measureTotalRevenue, 10)],
});
```
<img src="../../../img/column-chart-example-1.png" width="800"/>

## Param

Column chart properties

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

> **styleOptions**?: [`StackableStyleOptions`](../interfaces/interface.StackableStyleOptions.md)
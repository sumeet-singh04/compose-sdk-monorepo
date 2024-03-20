// This file re-exports common types/utils from @sisense/sdk-ui-preact

// Re-exports utils from @sisense/sdk-ui-preact
export { boxWhiskerProcessResult } from '@sisense/sdk-ui-preact';

// Re-exports types from @sisense/sdk-ui-preact
export type {
  ChartType,
  CartesianChartType,
  CategoricalChartType,
  ScatterChartType,
  IndicatorChartType,
  BoxplotChartType,
  ScattermapChartType,
  AreamapChartType,
  TableType,
  AreaSubtype,
  LineSubtype,
  PieSubtype,
  PolarSubtype,
  StackableSubtype,
  BoxplotSubtype,
  WidgetType,
  CartesianWidgetType,
  CategoricalWidgetType,
  TabularWidgetType,

  // Components Props:
  AreaChartProps,
  BarChartProps,
  ChartProps,
  LineChartProps,
  ColumnChartProps,
  FunnelChartProps,
  PolarChartProps,
  ScatterChartProps,
  PieChartProps,
  TreemapChartProps,
  SunburstChartProps,
  IndicatorChartProps,
  MemberFilterTileProps,
  CriteriaFilterTileProps,
  DateRangeFilterTileProps,
  ChartWidgetProps,
  TableWidgetProps,
  TableProps,
  PivotTableProps,
  DrilldownBreadcrumbsProps,
  BoxplotChartProps,
  AreamapChartProps,
  ScattermapChartProps,
  SisenseContextProviderProps,
  DashboardWidgetProps,

  // Hooks/Composables Props:
  ExecuteQueryByWidgetIdParams,
  ExecuteQueryParams,
  GetWidgetModelParams,
  // useExecuteCsvQuery is not ported to Vue yet
  // ExecuteCsvQueryParams,
  GetSharedFormulaParams,
  GetDashboardModelParams,
  UseGetSharedFormulaParams,
  GetDashboardModelsParams,

  // Data Options:
  ChartDataOptions,
  CartesianChartDataOptions,
  CategoricalChartDataOptions,
  ScatterChartDataOptions,
  IndicatorChartDataOptions,
  BoxplotChartDataOptions,
  BoxplotChartCustomDataOptions,
  ScattermapChartDataOptions,
  AreamapChartDataOptions,
  TableDataOptions,
  PivotTableDataOptions,
  WidgetDataOptions,

  // Data Options related:
  NumberFormatConfig,
  DecimalScale,
  DataColorCondition,
  ConditionalDataColorOptions,
  DataColorOptions,
  RangeDataColorOptions,
  UniformDataColorOptions,
  ValueToColorMap,
  MultiColumnValueToColorMap,
  SortDirection,
  BoxWhiskerType,
  ScattermapLocationLevel,
  StyledColumn,
  StyledMeasureColumn,

  // Style Options:
  ChartStyleOptions,
  LineStyleOptions,
  AreaStyleOptions,
  StackableStyleOptions,
  PieStyleOptions,
  FunnelStyleOptions,
  PolarStyleOptions,
  IndicatorStyleOptions,
  NumericSimpleIndicatorStyleOptions,
  NumericBarIndicatorStyleOptions,
  GaugeIndicatorStyleOptions,
  ScatterStyleOptions,
  TreemapStyleOptions,
  SunburstStyleOptions,
  BoxplotStyleOptions,
  ScattermapStyleOptions,
  AreamapStyleOptions,
  ChartWidgetStyleOptions,
  WidgetStyleOptions,
  DashboardWidgetStyleOptions,
  TableStyleOptions,
  PivotTableStyleOptions,

  // Style related:
  DataLimits,
  Legend,
  Markers,
  Labels,
  IndicatorComponents,
  ScatterMarkerSize,
  LineWidth,
  AxisLabel,
  Convolution,
  SeriesLabels,
  X2Title,
  ScattermapMarkers,

  // Models:
  WidgetModel,
  DashboardModel,

  // Charts related:
  BeforeRenderHandler,
  DataPoint,
  ScatterDataPoint,
  HighchartsOptions,
  BoxplotDataPoint,

  // General (Others)
  AppConfig,
  DateConfig,
  MenuItemSection,
  MonthOfYear,
  DayOfWeek,
  DateLevel,
  ThemeOid,
  GetDashboardModelOptions,
  GetDashboardModelsOptions,
  SeriesChartType,
  MenuPosition,
  ThemeSettings,
  Color,
  ColorPaletteTheme,
  Navigator,
  DrilldownOptions,
  DrilldownSelection,
  CriteriaFilterType,
  Member,
  FilterVariant,
} from '@sisense/sdk-ui-preact';

// Re-exports redefined types from @sisense/sdk-ui-preact
import type {
  ContextMenuProps as ContextMenuPropsPreact,
  ThemeProviderProps as ThemeProviderPropsPreact,
} from '@sisense/sdk-ui-preact';

export type ContextMenuProps = Omit<ContextMenuPropsPreact, 'children'>;
export type ThemeProviderProps = Omit<ThemeProviderPropsPreact, 'children'>;

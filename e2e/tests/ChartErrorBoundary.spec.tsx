import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { Chart } from '@sisense/sdk-ui';
import { SisenseContextProvider } from '@sisense/sdk-ui';
import { data, attributes, measures } from './__mocks__/dataMocks';
import { Data } from '@sisense/sdk-data';

const props = {
  chartType: 'line' as const,
  dataSet: data,
  dataOptions: {
    category: [attributes.years],
    value: [
      {
        column: measures.totalQuantity,
        showOnRightAxis: false,
      },
      {
        column: measures.totalUnits,
        showOnRightAxis: true,
        color: '#0000FF',
      },
    ],
    breakBy: [],
  },
};

test.describe('React ChartErrorBoundary', () => {
  test('should render error when broken context provided', async ({ mount, page }) => {
    const errorBoundary = await mount(
      <SisenseContextProvider url={'http://unexisting.com'} token={'broken-token'}>
        <Chart {...props} />
      </SisenseContextProvider>,
    );
    // check for error picture
    const svgElement = await page.waitForSelector('div#root svg[width="53px"][height="53px"]');
    expect(svgElement).toBeTruthy();

    // check for error message on hover
    await errorBoundary.hover();
    await expect(errorBoundary).toContainText('Error');
  });

  test('should render chart when nothing went wrong', async ({ mount, page }) => {
    const errorBoundary = await mount(<Chart {...props} />);

    // chart legend will contain column title
    await expect(errorBoundary).toContainText(props.dataOptions.value[0].column.title);
  });

  test('should render error just for a chart with broken dataSet provided', async ({
    mount,
    page,
  }) => {
    const errorBoundary = await mount(
      <div>
        <Chart {...props} dataSet={4 as unknown as Data} />
        <Chart {...props} />
      </div>,
    );

    // check for error picture
    const svgElement = await page.waitForSelector('div#root svg[width="53px"][height="53px"]');
    expect(svgElement).toBeTruthy();

    // chart legend will contain column title
    await expect(errorBoundary).toContainText(props.dataOptions.value[0].column.title);
  });
});

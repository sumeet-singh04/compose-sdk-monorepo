/* eslint-disable @typescript-eslint/unbound-method */
/** @vitest-environment jsdom */

import {
  type ClientApplication,
  getDashboardModel,
  getDashboardModels,
} from '@sisense/sdk-ui-preact';
import { type DashboardModel } from '../sdk-ui-core-exports';
import { Mock, Mocked } from 'vitest';
import { DashboardService } from './dashboard.service';
import { SisenseContextService } from './sisense-context.service';

vi.mock('@sisense/sdk-ui-preact', () => ({
  getDashboardModel: vi.fn(),
  getDashboardModels: vi.fn(),
}));

const getDashboardModelMock = getDashboardModel as Mock<
  Parameters<typeof getDashboardModel>,
  ReturnType<typeof getDashboardModel>
>;

const getDashboardModelsMock = getDashboardModels as Mock<
  Parameters<typeof getDashboardModels>,
  ReturnType<typeof getDashboardModels>
>;

describe('DashboardService', () => {
  let sisenseContextService: Mocked<SisenseContextService>;

  beforeEach(() => {
    getDashboardModelMock.mockClear();
    getDashboardModelsMock.mockClear();
    sisenseContextService = {
      getApp: vi.fn().mockResolvedValue({}),
    } as unknown as Mocked<SisenseContextService>;
  });

  it('should be created', () => {
    const dashboardService = new DashboardService(sisenseContextService);
    expect(dashboardService).toBeTruthy();
  });

  describe('getDashboardModel', () => {
    it('should retrieve an existing dashboard model', async () => {
      const dashboardOid = 'dashboard-oid';
      const expectedDashboardModel: DashboardModel = {
        oid: dashboardOid,
        title: 'test-dashboard',
        dataSource: 'test-data-source',
        widgets: [],
      };

      sisenseContextService.getApp.mockResolvedValue({ httpClient: {} } as ClientApplication);
      getDashboardModelMock.mockResolvedValue(expectedDashboardModel);

      const dashboardService = new DashboardService(sisenseContextService);
      const result = await dashboardService.getDashboardModel(dashboardOid);

      expect(result).toEqual(expectedDashboardModel);
      expect(sisenseContextService.getApp).toHaveBeenCalled();
      expect(getDashboardModelMock).toHaveBeenCalledWith({}, dashboardOid, undefined);
    });
  });

  describe('getDashboardModels', () => {
    it('should retrieve existing dashboard models', async () => {
      const expectedDashboardModels: DashboardModel[] = [
        {
          oid: 'test-dashboard-oid',
          title: 'test-dashboard',
          dataSource: 'test-data-source',
          widgets: [],
        },
      ];

      sisenseContextService.getApp.mockResolvedValue({ httpClient: {} } as ClientApplication);
      getDashboardModelsMock.mockResolvedValue(expectedDashboardModels);

      const dashboardService = new DashboardService(sisenseContextService);
      const result = await dashboardService.getDashboardModels();

      expect(result).toEqual(expectedDashboardModels);
      expect(sisenseContextService.getApp).toHaveBeenCalled();
      expect(getDashboardModelsMock).toHaveBeenCalledWith({}, undefined);
    });
  });
});

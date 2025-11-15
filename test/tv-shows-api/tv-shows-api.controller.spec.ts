jest.mock('src/modules/tv-shows/tv-shows.adaptor', () => ({
  TVShowsAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TVShowsApiController } from '../../src/apis/tv-shows-api/tv-shows-api.controller';
import { TVShowsApiService } from '../../src/apis/tv-shows-api/tv-shows-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpStatus } from '@nestjs/common';

describe('TVShowsApiController', () => {
  let controller: TVShowsApiController;
  let tvShowsApiService: any;
  let mockLogger: { log: jest.Mock };

  beforeEach(async () => {
    tvShowsApiService = {
      getAllTVShows: jest.fn(),
      createTVShow: jest.fn(),
    };

    mockLogger = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TVShowsApiController],
      providers: [
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: TVShowsApiService, useValue: tvShowsApiService },
      ],
    }).compile();

    controller = module.get<TVShowsApiController>(TVShowsApiController);
  });

  it('getAllTVShows should return NOT_FOUND when empty', async () => {
    const query = { page: 1, limit: 10 } as any;
    tvShowsApiService.getAllTVShows.mockResolvedValue([]);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.getAllTVShows(query, res);

    expect(tvShowsApiService.getAllTVShows).toHaveBeenCalledWith(query);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(send).toHaveBeenCalledWith({
      status: 'error',
      message: 'No TV shows found',
    });
  });

  it('getAllTVShows should return OK with data', async () => {
    const query = { page: 1, limit: 10 } as any;
    const shows = [{ id: 't1', title: 'Show' }];
    tvShowsApiService.getAllTVShows.mockResolvedValue(shows);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.getAllTVShows(query, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: shows });
  });

  it('addTVShow should return OK when service returns data', async () => {
    const req = { title: 'New Show' } as any;
    const created = { id: 't1', title: 'New Show' };
    tvShowsApiService.createTVShow.mockResolvedValue(created);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.addTVShow(req, res);

    expect(tvShowsApiService.createTVShow).toHaveBeenCalledWith(req);
    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: created });
  });

  it('addTVShow should return BAD_REQUEST when service returns null', async () => {
    const req = { title: 'Exist' } as any;
    tvShowsApiService.createTVShow.mockResolvedValue(null);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.addTVShow(req, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(send).toHaveBeenCalledWith({
      status: 'failed',
      message: 'Failed to create Tv Show',
    });
  });
});

jest.mock('src/modules/tv-shows/tv-shows.adaptor', () => ({
  TVShowsAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TVShowsApiService } from '../../src/apis/tv-shows-api/tv-shows-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TVShowsAdaptor } from 'src/modules/tv-shows/tv-shows.adaptor';

describe('TVShowsApiService', () => {
  let service: TVShowsApiService;
  let tvShowsAdaptor: any;
  let mockLogger: { log: jest.Mock; warn: jest.Mock };

  beforeEach(async () => {
    tvShowsAdaptor = {
      fetchAllTVShows: jest.fn(),
      searchTVShowByTitle: jest.fn(),
      saveTVShowdetails: jest.fn(),
    };

    mockLogger = { log: jest.fn(), warn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TVShowsApiService,
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: TVShowsAdaptor, useValue: tvShowsAdaptor },
      ],
    }).compile();

    service = module.get<TVShowsApiService>(TVShowsApiService);
  });

  it('getAllTVShows should call adaptor with page and limit', () => {
    const query = { page: 4, limit: 8 } as any;

    service.getAllTVShows(query);

    expect(tvShowsAdaptor.fetchAllTVShows).toHaveBeenCalledWith(4, 8);
  });

  it('createTVShow should return null when exists', async () => {
    const req = { title: 'Exist' } as any;
    tvShowsAdaptor.searchTVShowByTitle.mockResolvedValue({
      id: 't1',
      title: 'Exist',
    });

    const res = await service.createTVShow(req);

    expect(tvShowsAdaptor.searchTVShowByTitle).toHaveBeenCalledWith('Exist');
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('createTVShow should save and return when new', async () => {
    const req = { title: 'New Show' } as any;
    tvShowsAdaptor.searchTVShowByTitle.mockResolvedValue(null);
    tvShowsAdaptor.saveTVShowdetails.mockResolvedValue({
      id: 't2',
      title: 'New Show',
    });

    const res = await service.createTVShow(req);

    expect(tvShowsAdaptor.saveTVShowdetails).toHaveBeenCalledWith(req);
    expect(res).toEqual({ id: 't2', title: 'New Show' });
  });
});

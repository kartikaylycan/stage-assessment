jest.mock('src/modules/movies/movies.adaptor', () => ({
  MoviesAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesApiService } from '../../src/apis/movies-api/movies-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MoviesAdaptor } from 'src/modules/movies/movies.adaptor';

describe('MoviesApiService', () => {
  let service: MoviesApiService;
  let moviesAdaptor: any;
  let mockLogger: { log: jest.Mock; warn: jest.Mock };

  beforeEach(async () => {
    moviesAdaptor = {
      getAllMovies: jest.fn(),
      searchMovieByTitle: jest.fn(),
      saveMovieDetails: jest.fn(),
    };

    mockLogger = { log: jest.fn(), warn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesApiService,
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: MoviesAdaptor, useValue: moviesAdaptor },
      ],
    }).compile();

    service = module.get<MoviesApiService>(MoviesApiService);
  });

  it('getMoviesList should call adaptor with page and limit', () => {
    const query = { page: 3, limit: 7 } as any;

    service.getMoviesList(query);

    expect(moviesAdaptor.getAllMovies).toHaveBeenCalledWith(3, 7);
  });

  it('addMovie should return null when movie exists', async () => {
    const req = { title: 'Exist' } as any;
    moviesAdaptor.searchMovieByTitle.mockResolvedValue({
      id: 'm1',
      title: 'Exist',
    });

    const res = await service.addMovie(req);

    expect(moviesAdaptor.searchMovieByTitle).toHaveBeenCalledWith('Exist');
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('addMovie should save and return when new', async () => {
    const req = { title: 'New' } as any;
    moviesAdaptor.searchMovieByTitle.mockResolvedValue(null);
    moviesAdaptor.saveMovieDetails.mockResolvedValue({
      id: 'm2',
      title: 'New',
    });

    const res = await service.addMovie(req);

    expect(moviesAdaptor.saveMovieDetails).toHaveBeenCalledWith(req);
    expect(res).toEqual({ id: 'm2', title: 'New' });
  });
});

jest.mock('src/modules/movies/movies.adaptor', () => ({
  MoviesAdaptor: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesApiController } from '../../src/apis/movies-api/movies-api.controller';
import { MoviesApiService } from '../../src/apis/movies-api/movies-api.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpStatus } from '@nestjs/common';

describe('MoviesApiController', () => {
  let controller: MoviesApiController;
  let moviesApiService: any;
  let mockLogger: { log: jest.Mock };

  beforeEach(async () => {
    moviesApiService = {
      getMoviesList: jest.fn(),
      addMovie: jest.fn(),
    };

    mockLogger = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesApiController],
      providers: [
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: mockLogger },
        { provide: MoviesApiService, useValue: moviesApiService },
      ],
    }).compile();

    controller = module.get<MoviesApiController>(MoviesApiController);
  });

  it('getMoviesList should return NOT_FOUND when empty', async () => {
    const query = { page: 1, limit: 10 } as any;
    moviesApiService.getMoviesList.mockResolvedValue([]);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.getMoviesList(query, res);

    expect(moviesApiService.getMoviesList).toHaveBeenCalledWith(query);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(send).toHaveBeenCalledWith({ message: 'No movies found' });
  });

  it('getMoviesList should return OK with data', async () => {
    const query = { page: 1, limit: 10 } as any;
    const movies = [{ id: 'm1', title: 'Movie' }];
    moviesApiService.getMoviesList.mockResolvedValue(movies);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.getMoviesList(query, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: movies });
  });

  it('addMovie should return CREATED when service returns data', async () => {
    const req = { title: 'New', description: 'd' } as any;
    const created = { id: 'm1', title: 'New' };
    moviesApiService.addMovie.mockResolvedValue(created);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.addMovie(req, res);

    expect(moviesApiService.addMovie).toHaveBeenCalledWith(req);
    expect(status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(send).toHaveBeenCalledWith({ status: 'success', data: created });
  });

  it('addMovie should return BAD_REQUEST when service returns null', async () => {
    const req = { title: 'Exist' } as any;
    moviesApiService.addMovie.mockResolvedValue(null);

    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    const res = { status, send } as any;

    await controller.addMovie(req, res);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(send).toHaveBeenCalledWith({
      message: 'Failed to create movie record',
    });
  });
});

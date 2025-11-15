import { Injectable } from '@nestjs/common';
import { MoviesMongoDbService } from './schema/movies-mongoDb.service';
import { Movie } from './models/moves.interface';
import { AddMovieDto } from 'src/apis/movies-api/dto/movies.dto';

@Injectable()
export class MoviesAdaptor {
  constructor(private readonly moviesMongoDbService: MoviesMongoDbService) {}

  async getAllMovies(page: number, limit: number): Promise<Partial<Movie>[]> {
    const moviesData = await this.moviesMongoDbService.fetchAllMovies(
      page,
      limit,
    );
    return (moviesData ?? []).map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        genres: movie.genres,
        releaseDate: movie.releaseDate,
        director: movie.director,
        actors: movie.actors,
      };
    });
  }

  async saveMovieDetails(movieDetails: AddMovieDto): Promise<Movie> {
    const movieData: Partial<Movie> = {
      title: movieDetails.title,
      description: movieDetails.description,
      genres: movieDetails.genres,
      releaseDate: movieDetails.releaseDate,
      director: movieDetails.director,
      actors: movieDetails.actors,
    };

    const createdMovie =
      await this.moviesMongoDbService.createAMovieRecord(movieData);
    return {
      id: createdMovie.id,
      title: createdMovie.title,
      description: createdMovie.description,
      genres: createdMovie.genres,
      releaseDate: createdMovie.releaseDate,
      director: createdMovie.director,
      actors: createdMovie.actors,
    };
  }

  searchMovieByTitle(title: string): Promise<Movie | null> {
    return this.moviesMongoDbService.fetchMovieByTitle(title);
  }
}

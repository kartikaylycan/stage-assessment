import { Genre } from 'src/models/genre.interface';

export interface TVShow {
  id?: string;
  title: string;
  description: string;
  genres: Genre[];
  episodes: Array<{
    id?: string;
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

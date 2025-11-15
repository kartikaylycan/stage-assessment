import { Genre } from 'src/models/genre.interface';

export type UserPreferences = {
  favoriteGenres: Genre[];
  dislikedGenres: Genre[];
};

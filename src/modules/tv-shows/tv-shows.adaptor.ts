import { Injectable } from '@nestjs/common';
import { TVShowsMongoDbService } from './schema/tv-shows-mongoDb.service';
import { TVShow } from './models/tv-shows.interface';
import { AddTVShowDto } from 'src/apis/tv-shows-api/dto/tv-shows.dto';

@Injectable()
export class TVShowsAdaptor {
  constructor(private readonly tvShowsmongoDbService: TVShowsMongoDbService) {}

  async fetchAllTVShows(page: number, limit: number) {
    const tvShowsData = await this.tvShowsmongoDbService.fetchAllTVShows(
      page,
      limit,
    );
    return (tvShowsData ?? []).map((tvShow) => {
      return {
        id: tvShow.id,
        title: tvShow.title,
        description: tvShow.description,
        genres: tvShow.genres,
        episodes: (tvShow.episodes || []).map((episode) => {
          return {
            id: episode.id,
            episodeNumber: episode.episodeNumber,
            seasonNumber: episode.seasonNumber,
            releaseDate: episode.releaseDate,
            director: episode.director,
            actors: episode.actors,
          };
        }),
      };
    });
  }

  searchTVShowByTitle(title: string): Promise<TVShow | null> {
    return this.tvShowsmongoDbService.fetchTVShowByTitle(title);
  }

  async saveTVShowdetails(tvShowDetails: AddTVShowDto) {
    const tvShowData: TVShow = {
      title: tvShowDetails.title,
      description: tvShowDetails.description,
      genres: tvShowDetails.genres,
      episodes: tvShowDetails.episodes,
    };

    const createdTvShow =
      await this.tvShowsmongoDbService.createATVShowRecord(tvShowData);

    return {
      id: createdTvShow.id,
      title: createdTvShow.title,
      description: createdTvShow.description,
      genres: createdTvShow.genres,
      episodes: createdTvShow.episodes.map((episode) => {
        return {
          id: episode.id,
          episodeNumber: episode.episodeNumber,
          seasonNumber: episode.seasonNumber,
          releaseDate: episode.releaseDate,
          director: episode.director,
          actors: episode.actors,
        };
      }),
    };
  }
}

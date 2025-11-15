import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Genre } from 'src/models/genre.interface';
import { GENRE_VALUES } from 'src/utils/constants';

export class FetchTVShowsListDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;
}

export class TVShowEpisodeDto {
  @IsNotEmpty()
  @Type(() => Number)
  episodeNumber: number;

  @IsNotEmpty()
  @Type(() => Number)
  seasonNumber: number;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  releaseDate: Date;

  @IsNotEmpty()
  @Type(() => String)
  director: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @Type(() => String)
  actors: string[];
}

export class AddTVShowDto {
  @IsNotEmpty()
  @Type(() => String)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @Type(() => String)
  @MaxLength(1000)
  description: string;

  @IsArray()
  @IsIn(GENRE_VALUES, { each: true })
  genres: Genre[];

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Atleast 1 episode should be present in a TV show',
  })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TVShowEpisodeDto)
  episodes: TVShowEpisodeDto[];
}

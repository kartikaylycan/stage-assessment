import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Genre } from 'src/models/genre.interface';
import { GENRE_VALUES } from 'src/utils/constants';

export class FetchMoviesDto {
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

export class AddMovieDto {
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

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  releaseDate: Date;

  @IsNotEmpty()
  @Type(() => String)
  director: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => String)
  actors: string[];
}

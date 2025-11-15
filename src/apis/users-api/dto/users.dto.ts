import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GENRE_VALUES } from 'src/utils/constants';
import { Genre } from 'src/models/genre.interface';

export class UserPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsIn(GENRE_VALUES, { each: true })
  favoriteGenres?: Genre[];

  @IsOptional()
  @IsArray()
  @IsIn(GENRE_VALUES, { each: true })
  dislikedGenres?: Genre[];
}

export class AddUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences: UserPreferencesDto;
}

export class FetchUsersDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  @Type(() => Boolean)
  fetchInactive: boolean = false;
}

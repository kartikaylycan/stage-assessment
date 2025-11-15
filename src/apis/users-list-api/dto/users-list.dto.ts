import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { UserContentCategory } from '../util/enum';

export class FetchUsersListDto {
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

export class AddContentToUserList {
  @IsNotEmpty()
  @Type(() => String)
  userId: string;

  @IsNotEmpty()
  @Type(() => String)
  contentId: string;

  @IsEnum(UserContentCategory)
  category: UserContentCategory;
}

export class RemoveContentFromUserListDto extends AddContentToUserList {}

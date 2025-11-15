import { IsEnum, IsNotEmpty } from 'class-validator';
import { ListContentCategory } from '../utils/enum';

export class addContentToUserListDto {
  @IsNotEmpty()
  @IsEnum(ListContentCategory)
  category: ListContentCategory;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  itemId: string;
}

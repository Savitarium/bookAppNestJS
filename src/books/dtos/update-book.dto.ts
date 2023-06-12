/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000)
  price: number;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  authorId: string;
}
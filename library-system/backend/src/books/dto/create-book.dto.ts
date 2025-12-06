import { IsString, IsOptional, IsDateString, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'Harry Potter and the Philosopher\'s Stone' })
  @IsString()
  title: string;

  @ApiProperty({ example: '978-0747532699' })
  @IsString()
  isbn: string;

  @ApiPropertyOptional({ example: '1997-06-26' })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiPropertyOptional({ example: 'The first book in the Harry Potter series' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalCopies: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  availableCopies: number;

  @ApiProperty({ example: 'uuid-of-author' })
  @IsUUID()
  authorId: string;
}
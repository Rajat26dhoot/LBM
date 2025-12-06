import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ example: 'uuid-of-book' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;
}
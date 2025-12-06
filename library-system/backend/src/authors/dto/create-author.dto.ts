import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'British author, best known for the Harry Potter series',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: '1965-07-31', // client sends simple date string
    description: 'Birth date in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString() // still validates ISO date
  birthDate?: string;
}

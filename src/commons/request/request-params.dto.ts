import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilteringParamsDto {
  @IsString()
  @IsOptional()
  filter?: string | string[];
}

export class PaginationParamsDto {
  @IsNumberString()
  page: string;

  @IsNumberString()
  size: string;
}

export class SortingParamsDto {
  @IsString()
  @IsOptional()
  sort?: string;
}

export class PaginatedFilteredSortedRequestParams
  implements FilteringParamsDto, PaginationParamsDto, SortingParamsDto
{
  @ApiProperty({
    description: 'Pagination page number, starts from 0',
    example: '0',
  })
  page: string;

  @ApiProperty({
    description: 'Pagination page size. Items count = page * size',
    example: '10',
  })
  size: string;

  @ApiPropertyOptional({
    description: 'Sorting rule fromat - [fieldName]:[asc|desc].',
    example: 'createdAt:desc',
  })
  sort?: string;

  @ApiPropertyOptional({
    description:
      'Filter rules format: [fieldName]:[eq | neq | gt | gte | lt | lte ]:[value | value,value]. Multiple filter params can be separated by comma. ',
    example: 'id:neq:123',
  })
  filter?: string;
}

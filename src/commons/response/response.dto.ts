import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiHideProperty,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class PaginatedResource<T> {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  items: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}

export class ResponseDto<Result> {
  @ApiProperty({ required: true })
  status: boolean;

  @ApiHideProperty()
  result?: Result;

  @ApiProperty({ required: false })
  message?: string;
}

/**
 * Combined ApiResponse decorator to set standard API response structure to all responses.
 * Supports array and single type result structures.
 *
 * @param dataDto response.result field type
 * @param wrapperDto wrapper schema (e.g. PaginatedResource)
 * @returns combined Swagger decorators
 */
export const ApiResponse = <
  DataDto extends Type<unknown>,
  WrapperDto extends Type<unknown> | undefined = undefined,
>(
  dataDto?: DataDto | DataDto[],
  wrapperDto?: WrapperDto,
) => {
  const resultSchema =
    dataDto === undefined
      ? undefined
      : Array.isArray(dataDto)
        ? {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto[0]) },
          }
        : wrapperDto
          ? {
              allOf: [
                { $ref: getSchemaPath(wrapperDto) },
                {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: { $ref: getSchemaPath(dataDto) },
                    },
                  },
                },
              ],
            }
          : { $ref: getSchemaPath(dataDto) };

  const responseSchema = {
    allOf: [
      { $ref: getSchemaPath(ResponseDto) },
      resultSchema ? { properties: { result: resultSchema } } : {},
    ],
  };

  const decorators = [
    dataDto
      ? ApiExtraModels(
          ResponseDto,
          Array.isArray(dataDto) ? dataDto[0] : dataDto,
          ...(wrapperDto ? [wrapperDto] : []),
        )
      : undefined,

    ApiOkResponse({ schema: responseSchema }),

    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
        },
      },
    }),
  ];

  return applyDecorators(
    ...(decorators.filter((decorator) => decorator !== undefined) as Array<
      ClassDecorator | MethodDecorator | PropertyDecorator
    >),
  );
};

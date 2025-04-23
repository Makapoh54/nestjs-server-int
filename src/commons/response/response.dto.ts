import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ResponseDto<Result> {
  /**
   * Response status. False in case of error (non 200 response)'
   */
  @ApiProperty({ required: true })
  status: boolean;

  /**
   * Result data. May be undefined in case of error.
   */
  @ApiHideProperty()
  result?: Result;

  /**
   * Response message. Describes response details or error message.
   */
  @ApiProperty({ required: false })
  message?: string;
}

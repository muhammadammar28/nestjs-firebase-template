import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const AcceptEncoding = () => {
  return applyDecorators(
    SetMetadata('encoding', true),
    ApiHeader({
      name: 'encoding',
      description: 'Encoding type gzip',
      required: false,
      example: 'gzip',
    }),
  );
};

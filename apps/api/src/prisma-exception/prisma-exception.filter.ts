import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@repo/database';

import { ERROR_CODES } from 'src/utils/constants';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        return response
          .status(409)
          .json({ message: ERROR_CODES.USER_ALREADY_EXISTS });
      case 'P2025':
        return response
          .status(401)
          .json({ message: ERROR_CODES.USER_ALREADY_EXISTS });
      default:
        console.log('Prisma Exception:', exception);
        return response
          .status(500)
          .json({ message: ERROR_CODES.INTERNAL_SERVER_ERROR });
    }
  }
}

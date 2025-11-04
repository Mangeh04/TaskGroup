import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@repo/database';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        return response.status(409).json({ message: 'This registery already exists' });
      case 'P2025':
        return response.status(404).json({ message: 'Registery not found' });
      default:
        return response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

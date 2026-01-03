import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  PROJECT_MEMBER_GUARD_ERROR_CODES,
  SERVICES,
} from 'src/utils/constants';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user as JwtPayload;
    if (!user || !user.sub) {
      throw new UnauthorizedException({
        message: PROJECT_MEMBER_GUARD_ERROR_CODES.USER_NOT_IN_REQUEST,
      });
    }
    const userId = user.sub;

    const projectId = request.body?.projectId || request.params?.projectId;
    if (!projectId) {
      throw new BadRequestException({
        message: PROJECT_MEMBER_GUARD_ERROR_CODES.MISSING_PROJECT_ID,
      });
    }

    const membership = await this.prismaService.projectMembership.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException({
        message: PROJECT_MEMBER_GUARD_ERROR_CODES.MEMBERSHIP_NOT_FOUND,
      });
    }

    return true;
  }
}

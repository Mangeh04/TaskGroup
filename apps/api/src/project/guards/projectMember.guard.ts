import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import { SERVICES } from 'src/utils/constants';

interface RequestUser {
  id: string;
}

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user as RequestUser;
    if (!user || !user.id) {
      throw new UnauthorizedException('User not found in request.');
    }
    const userId = user.id;

    const projectId = request.body.projectId || request.params.projectId;
    if (!projectId) {
      throw new BadRequestException(
        'projectId must be provided in body or params.',
      );
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
      throw new ForbiddenException('You are not a member of this project.');
    }

    return true;
  }
}

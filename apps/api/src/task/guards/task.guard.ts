import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Role } from '@repo/database';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { SERVICES, TASK_GUARD_ERROR_CODES } from 'src/utils/constants';

@Injectable()
export class TaskGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.PRISMA) private readonly prismaService: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user as JwtPayload;
    if (!user || !user.sub) {
      throw new UnauthorizedException({
        message: TASK_GUARD_ERROR_CODES.USER_NOT_IN_REQUEST,
      });
    }
    const userId = user.sub;

    const taskId = request.params.id;
    if (!taskId) {
      throw new NotFoundException({
        message: TASK_GUARD_ERROR_CODES.TASK_ID_MISSING,
      });
    }

    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });

    if (!task) {
      throw new NotFoundException({
        message: TASK_GUARD_ERROR_CODES.TASK_NOT_FOUND,
      });
    }
    const projectId = task.projectId;

    const membership = await this.prismaService.projectMembership.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
      select: { role: true },
    });

    if (
      membership &&
      (membership.role === Role.OWNER || membership.role === Role.ADMIN)
    ) {
      return true;
    }

    const assignment = await this.prismaService.task.findFirst({
      where: {
        assignedUserId: userId,
        projectId,
      },
    });

    if (assignment) {
      return true;
    }

    throw new ForbiddenException({
      message: TASK_GUARD_ERROR_CODES.FORBIDDEN,
    });
  }
}

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
import { SERVICES } from 'src/utils/constants';

interface RequestUser {
  id: string;
}

@Injectable()
export class TaskGuard implements CanActivate {
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

    const taskId = request.params.id;
    if (!taskId) {
      throw new NotFoundException('Task ID not found in request params.');
    }

    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
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

    const assignment = await this.prismaService.taskAssignment.findUnique({
      where: {
        userId_taskId: { userId, taskId },
      },
    });

    if (assignment) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to modify this task.',
    );
  }
}

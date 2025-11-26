import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@repo/database';
import { SERVICES } from 'src/utils/constants';
import type { IProjectService } from '../interfaces/project.interface';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    const projectId = request.params.id;
    const userId = user.sub;

    if (!projectId) {
      throw new BadRequestException(
        'Project ID is required in the URL parameter',
      );
    }

    const membership = await this.projectService.getMembership(
      userId,
      projectId,
    );

    if (!membership) {
      throw new NotFoundException();
    }

    if (membership.role === Role.MEMBER) {
      throw new ForbiddenException(
        'You do not have permission to do this action(requires ADMIN role)',
      );
    }

    return true;
  }
}

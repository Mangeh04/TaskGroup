import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SERVICES } from 'src/utils/constants';
import type { IProjectService } from '../interfaces/project.interface';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import type { ProjectDtoUpdate } from '../dtos/projectDtoUpdate.dto';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    @Inject(SERVICES.PROJECT) private projectService: IProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const body = request.body as ProjectDtoUpdate;

    const projectId = body.id;
    const userId = user.userId;

    if (!projectId) {
      throw new BadRequestException('Project ID is required in the body');
    }

    const membership = await this.projectService.getMembership(
      userId,
      projectId,
    );

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const allowedRoles = ['OWNER', 'ADMIN'];

    if (allowedRoles.includes(membership.role)) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to modify this project (requires OWNER or ADMIN role)',
    );
  }
}

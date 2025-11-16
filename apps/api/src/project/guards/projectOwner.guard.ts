// src/project/guards/project-owner.guard.ts

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
import { Role } from '@repo/database'; // Tu enum de Roles

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
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
      throw new ForbiddenException('You are not a member of this project');
    }

    if (membership.role !== Role.OWNER) {
      throw new ForbiddenException(
        'You do not have permission to delete this project (requires OWNER role)',
      );
    }

    return true;
  }
}

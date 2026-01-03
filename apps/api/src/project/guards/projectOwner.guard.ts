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
import { PROJECT_OWNER_GUARD_ERROR_CODES, SERVICES } from 'src/utils/constants';
import type { IProjectService } from '../interfaces/project.interface';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

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
      throw new BadRequestException({
        message: PROJECT_OWNER_GUARD_ERROR_CODES.MISSING_PROJECT_ID_PARAM,
      });
    }

    const membership = await this.projectService.getMembership(
      userId,
      projectId,
    );

    if (!membership) {
      throw new NotFoundException({
        message: PROJECT_OWNER_GUARD_ERROR_CODES.MEMBERSHIP_NOT_FOUND,
      });
    }

    if (membership.role !== Role.OWNER) {
      throw new ForbiddenException({
        message: PROJECT_OWNER_GUARD_ERROR_CODES.INSUFFICIENT_ROLE,
      });
    }

    return true;
  }
}

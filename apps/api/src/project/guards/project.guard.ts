import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SERVICES, PROJECT_GUARD_ERROR_CODES } from 'src/utils/constants';
import type { IProjectService } from '../interfaces/project.interface';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
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

    const projectId = body?.id;
    const userId = user.sub;

    if (!projectId) {
      throw new BadRequestException({
        message: PROJECT_GUARD_ERROR_CODES.MISSING_PROJECT_ID,
      });
    }

    const membership = await this.projectService.getMembership(
      userId,
      projectId,
    );

    if (!membership) {
      throw new ForbiddenException({
        message: PROJECT_GUARD_ERROR_CODES.NOT_A_MEMBER,
      });
    }

    const allowedRoles = ['OWNER', 'ADMIN'];

    if (allowedRoles.includes(membership.role as any)) {
      return true;
    }

    throw new ForbiddenException({
      message: PROJECT_GUARD_ERROR_CODES.INSUFFICIENT_ROLE,
    });
  }
}

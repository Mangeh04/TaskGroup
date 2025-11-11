import { Test, TestingModule } from '@nestjs/testing';
import { ProjectControllerTsController } from './project.controller';

describe('ProjectControllerTsController', () => {
  let controller: ProjectControllerTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectControllerTsController],
    }).compile();

    controller = module.get<ProjectControllerTsController>(
      ProjectControllerTsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

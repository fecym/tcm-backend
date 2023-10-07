import { Test, TestingModule } from '@nestjs/testing';
import { ShennongHerbsController } from './shennong-herbs.controller';
import { ShennongHerbsService } from './shennong-herbs.service';

describe('ShennongHerbsController', () => {
  let controller: ShennongHerbsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShennongHerbsController],
      providers: [ShennongHerbsService],
    }).compile();

    controller = module.get<ShennongHerbsController>(ShennongHerbsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

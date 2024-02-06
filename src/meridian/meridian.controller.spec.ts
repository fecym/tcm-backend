import { Test, TestingModule } from '@nestjs/testing';
import { MeridianController } from './meridian.controller';
import { MeridianService } from './meridian.service';

describe('MeridianController', () => {
  let controller: MeridianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeridianController],
      providers: [MeridianService],
    }).compile();

    controller = module.get<MeridianController>(MeridianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

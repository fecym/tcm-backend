import { Test, TestingModule } from '@nestjs/testing';
import { AcuPointController } from './acu-point.controller';
import { AcuPointService } from './acu-point.service';

describe('AcuPointController', () => {
  let controller: AcuPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcuPointController],
      providers: [AcuPointService],
    }).compile();

    controller = module.get<AcuPointController>(AcuPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

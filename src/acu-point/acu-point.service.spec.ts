import { Test, TestingModule } from '@nestjs/testing';
import { AcuPointService } from './acu-point.service';

describe('AcuPointService', () => {
  let service: AcuPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcuPointService],
    }).compile();

    service = module.get<AcuPointService>(AcuPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

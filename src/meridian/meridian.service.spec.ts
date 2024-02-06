import { Test, TestingModule } from '@nestjs/testing';
import { MeridianService } from './meridian.service';

describe('MeridianService', () => {
  let service: MeridianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeridianService],
    }).compile();

    service = module.get<MeridianService>(MeridianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

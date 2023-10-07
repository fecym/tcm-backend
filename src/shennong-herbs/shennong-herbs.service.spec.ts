import { Test, TestingModule } from '@nestjs/testing';
import { ShennongHerbsService } from './shennong-herbs.service';

describe('ShennongHerbsService', () => {
  let service: ShennongHerbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShennongHerbsService],
    }).compile();

    service = module.get<ShennongHerbsService>(ShennongHerbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

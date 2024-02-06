import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';

describe('DictionaryController', () => {
  let controller: DictionaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryController],
      providers: [DictionaryService],
    }).compile();

    controller = module.get<DictionaryController>(DictionaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

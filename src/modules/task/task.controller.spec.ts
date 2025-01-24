import { Test, TestingModule } from '@nestjs/testing';
import { TareaController } from './task.controller';
import { TareaService } from './task.service';

describe('FichaProfesionalController', () => {
  let controller: TareaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareaController],
      providers: [TareaService],
    }).compile();

    controller = module.get<TareaController>(TareaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

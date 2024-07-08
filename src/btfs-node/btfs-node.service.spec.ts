import { Test, TestingModule } from '@nestjs/testing';
import { BtfsNodeService } from './btfs-node.service';

describe('BtfsNodeService', () => {
  let service: BtfsNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BtfsNodeService],
    }).compile();

    service = module.get<BtfsNodeService>(BtfsNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

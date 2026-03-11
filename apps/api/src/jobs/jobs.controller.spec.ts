import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  const mockJobsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: mockJobsService,
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a job', async () => {
      const createJobDto = {
        companyName: 'Google',
        roleTitle: 'Software Engineer',
      };
      const mockJob = { id: '123', ...createJobDto };
      
      mockJobsService.create.mockResolvedValue(mockJob);

      const result = await controller.create(createJobDto, 'user-123');
      
      expect(result).toEqual(mockJob);
      expect(mockJobsService.create).toHaveBeenCalledWith(createJobDto, 'user-123');
    });
  });

  describe('findAll', () => {
    it('should return all jobs for a user', async () => {
      const mockJobs = [{ id: '123', companyName: 'Google' }];
      
      mockJobsService.findAll.mockResolvedValue(mockJobs);

      const result = await controller.findAll('user-123');
      
      expect(result).toEqual(mockJobs);
      expect(mockJobsService.findAll).toHaveBeenCalledWith('user-123');
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      const mockJob = { id: '123', companyName: 'Google' };
      
      mockJobsService.findOne.mockResolvedValue(mockJob);

      const result = await controller.findOne('123', 'user-123');
      
      expect(result).toEqual(mockJob);
      expect(mockJobsService.findOne).toHaveBeenCalledWith('123', 'user-123');
    });
  });

  describe('remove', () => {
    it('should delete a job', async () => {
      mockJobsService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('123', 'user-123');
      
      expect(result).toEqual({ deleted: true });
      expect(mockJobsService.remove).toHaveBeenCalledWith('123', 'user-123');
    });
  });
});

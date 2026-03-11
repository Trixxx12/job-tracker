import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, JobStatus } from './dto/create-job.dto';

// Mock the knex module
jest.mock('knex', () => {
  const mockKnex = jest.fn(() => mockKnex);
  mockKnex.insert = jest.fn().mockReturnThis();
  mockKnex.returning = jest.fn();
  mockKnex.where = jest.fn().mockReturnThis();
  mockKnex.orderBy = jest.fn();
  mockKnex.first = jest.fn();
  mockKnex.update = jest.fn().mockReturnThis();
  mockKnex.delete = jest.fn();
  return jest.fn(() => mockKnex);
});

describe('JobsService', () => {
  let service: JobsService;

  const mockJob = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: 'user-123',
    company_name: 'Google',
    role_title: 'Software Engineer',
    status: 'pending',
    platform: 'linkedin',
    job_url: 'https://linkedin.com/jobs/123',
    notes: 'Great opportunity',
    applied_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a job application', async () => {
      const createJobDto: CreateJobDto = {
        companyName: 'Google',
        roleTitle: 'Software Engineer',
        status: JobStatus.PENDING,
        platform: 'linkedin',
        jobUrl: 'https://linkedin.com/jobs/123',
        notes: 'Great opportunity',
      };

      const knex = require('knex')();
      knex.returning.mockResolvedValue([mockJob]);

      const result = await service.create(createJobDto, 'user-123');
      
      expect(result).toEqual(mockJob);
    });
  });

  describe('findAll', () => {
    it('should return an array of jobs', async () => {
      const knex = require('knex')();
      knex.orderBy.mockResolvedValue([mockJob]);

      const result = await service.findAll('user-123');
      
      expect(result).toEqual([mockJob]);
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      const knex = require('knex')();
      knex.first.mockResolvedValue(mockJob);

      const result = await service.findOne(mockJob.id, 'user-123');
      
      expect(result).toEqual(mockJob);
    });

    it('should throw NotFoundException if job not found', async () => {
      const knex = require('knex')();
      knex.first.mockResolvedValue(undefined);

      await expect(service.findOne('non-existent', 'user-123'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a job and return deleted: true', async () => {
      const knex = require('knex')();
      knex.delete.mockResolvedValue(1);

      const result = await service.remove(mockJob.id, 'user-123');
      
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if job not found', async () => {
      const knex = require('knex')();
      knex.delete.mockResolvedValue(0);

      await expect(service.remove('non-existent', 'user-123'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});

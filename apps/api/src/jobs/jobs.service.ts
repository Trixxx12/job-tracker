import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import knex, { Knex } from 'knex';

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  status: string;
  platform?: string;
  job_url?: string;
  applied_at: Date;
  notes?: string;
  email_id?: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class JobsService {
  private db: Knex;

  constructor() {
    this.db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL || {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'jobtracker',
      },
    });
  }

  async create(
    createJobDto: CreateJobDto,
    userId: string,
  ): Promise<JobApplication> {
    const [job] = await this.db<JobApplication>('job_applications')
      .insert({
        user_id: userId,
        company_name: createJobDto.companyName,
        role_title: createJobDto.roleTitle,
        status: createJobDto.status || 'pending',
        platform: createJobDto.platform,
        job_url: createJobDto.jobUrl,
        notes: createJobDto.notes,
      })
      .returning('*');
    return job;
  }

  async findAll(userId: string): Promise<JobApplication[]> {
    return this.db<JobApplication>('job_applications')
      .where({ user_id: userId })
      .orderBy('applied_at', 'desc');
  }

  async findOne(id: string, userId: string): Promise<JobApplication> {
    const job = await this.db<JobApplication>('job_applications')
      .where({ id, user_id: userId })
      .first();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    userId: string,
  ): Promise<JobApplication> {
    const [job] = await this.db<JobApplication>('job_applications')
      .where({ id, user_id: userId })
      .update({
        company_name: updateJobDto.companyName,
        role_title: updateJobDto.roleTitle,
        status: updateJobDto.status,
        platform: updateJobDto.platform,
        job_url: updateJobDto.jobUrl,
        notes: updateJobDto.notes,
        updated_at: new Date(),
      })
      .returning('*');
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const deleted = await this.db<JobApplication>('job_applications')
      .where({ id, user_id: userId })
      .delete();
    if (!deleted) throw new NotFoundException('Job not found');
    return { deleted: true };
  }
}

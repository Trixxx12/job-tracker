import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
  PENDING = 'pending',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  WITHDRAWN = 'withdrawn',
}

export class CreateJobDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  roleTitle: string;

  @ApiProperty({ enum: JobStatus, default: JobStatus.PENDING })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiProperty({ example: 'linkedin', required: false })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({ example: 'https://linkedin.com/jobs/123', required: false })
  @IsUrl()
  @IsOptional()
  jobUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

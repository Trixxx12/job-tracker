import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID (temp, will use auth later)',
  })
  create(
    @Body() createJobDto: CreateJobDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.jobsService.create(createJobDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job applications' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  findAll(@Headers('x-user-id') userId: string) {
    return this.jobsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job application' })
  findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.jobsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job application' })
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.jobsService.update(id, updateJobDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job application' })
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.jobsService.remove(id, userId);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TaskService } from './task.service';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create.task.dto";
import { UpdateTaskDto } from "./dto/update.task.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { User } from '../user/decorators/user.decorator'
import { GetTasksParamsDto } from "./dto/get.tasks.params.dto";

@ApiTags('Task')
@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Получить список задач!' })
  @HttpCode(200)
  @Get()
  async getAllTasks(
    @User() user,
    @Query() query: GetTasksParamsDto
  ): Promise<Task[]> {
    return await this.taskService.getAllTasks({ ...query, userId: user.id });
  }

  @ApiOperation({ summary: 'Получить задачу по ID!' })
  @HttpCode(200)
  @Get(':id')
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @ApiOperation({ summary: 'Создать задачу!' })
  @HttpCode(201)
  @Post()
  async createTask(
    @User() user,
    @Body() dto: CreateTaskDto
  ): Promise<Task> {
    return await this.taskService.createTask({ ...dto, userId: user.id });
  }

  @ApiOperation({ summary: 'Обновить задачу!' })
  @HttpCode(200)
  @Patch(':id')
  async updateTask(
    @User() user,
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto
  ): Promise<void> {
    return await this.taskService.updateTask(id, { ...dto, userId: user.id });
  }

  @ApiOperation({ summary: 'Удалить задачу!' })
  @HttpCode(200)
  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    return await this.taskService.deleteTask(id);
  }
}

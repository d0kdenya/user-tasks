import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create.task.dto";
import { UpdateTaskDto } from "./dto/update.task.dto";
import { GetTasksParamsDto } from "./dto/get.tasks.params.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(query?: GetTasksParamsDto): Promise<Task[]> {
    const taskQuery = this.taskRepository.createQueryBuilder('t');

    if (query.limit) {
      taskQuery.take(query.limit).skip(query.offset);
    }
    if (query.userId) {
      taskQuery
        .innerJoin('t.user', 'u')
        .andWhere('u.id = :userId', { userId: query.userId })
    }

    return await taskQuery.getMany();
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id
      }
    });

    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const deadlineDate = new Date(dto.deadline);

    const todo = await this.taskRepository.create({
      ...dto,
      deadline: deadlineDate
    });

    return await this.taskRepository.save(todo);
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<void> {
    const task = await this.getTaskById(id);

    const deadlineDate = dto.deadline ? new Date(dto.deadline) : task.deadline;

    await this.taskRepository.update(id, {
      ...dto,
      deadline: deadlineDate
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.getTaskById(id);
    await this.taskRepository.delete({ id });
  }
}

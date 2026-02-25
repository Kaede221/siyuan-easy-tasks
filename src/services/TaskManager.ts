/**
 * TaskManager - 应用层
 * 任务管理的核心服务，负责所有任务相关的业务逻辑
 */

import type { Task, TaskStatus, TaskFilter } from "@/types/todo";
import type { StorageService } from "./StorageService";
import { TaskStatus as TaskStatusEnum } from "@/types/todo";

export class TaskManager {
  private tasks: Task[] = [];
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  /**
   * 初始化 - 从存储加载任务
   */
  async initialize(): Promise<void> {
    this.tasks = await this.storageService.loadTasks();
  }

  /**
   * 添加任务
   */
  async addTask(
    content: string,
    blockId: string,
    note?: string,
    isManual: boolean = false,
  ): Promise<Task> {
    const task: Task = {
      id: this.generateUUID(),
      content,
      blockId,
      status: TaskStatusEnum.TODO,
      createdAt: Date.now(),
      note,
      isManual,
    };

    this.tasks.push(task);
    await this.storageService.saveTasks(this.tasks);

    return task;
  }

  /**
   * 更新任务
   */
  async updateTask(
    taskId: string,
    updates: Partial<Pick<Task, "content" | "note">>,
  ): Promise<void> {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    const task = this.tasks[taskIndex];

    // 创建新的任务对象以触发 Vue 响应式更新
    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: Date.now(),
    };

    // 替换任务数组中的任务
    this.tasks[taskIndex] = updatedTask;

    await this.storageService.saveTasks(this.tasks);
  }

  /**
   * 更新任务状态
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    const task = this.tasks[taskIndex];

    // 创建新的任务对象以触发 Vue 响应式更新
    const updatedTask: Task = {
      ...task,
      status,
      completedAt: status === TaskStatusEnum.COMPLETED ? Date.now() : undefined,
    };

    // 替换任务数组中的任务
    this.tasks[taskIndex] = updatedTask;

    await this.storageService.saveTasks(this.tasks);
  }

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    this.tasks.splice(index, 1);
    await this.storageService.saveTasks(this.tasks);
  }

  /**
   * 批量删除已完成的任务
   */
  async batchDeleteCompleted(): Promise<void> {
    this.tasks = this.tasks.filter(
      (t) => t.status !== TaskStatusEnum.COMPLETED,
    );
    await this.storageService.saveTasks(this.tasks);
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  /**
   * 根据ID获取任务
   */
  getTaskById(taskId: string): Task | null {
    return this.tasks.find((t) => t.id === taskId) || null;
  }

  /**
   * 过滤任务
   */
  filterTasks(filter: TaskFilter): Task[] {
    let result = [...this.tasks];

    // 按状态过滤
    if (filter.status !== undefined) {
      result = result.filter((t) => t.status === filter.status);
    }

    // 按关键词搜索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      result = result.filter((t) => t.content.toLowerCase().includes(keyword));
    }

    return result;
  }

  /**
   * 搜索任务（不区分大小写）
   */
  searchTasks(keyword: string): Task[] {
    if (!keyword) {
      return [...this.tasks];
    }

    const lowerKeyword = keyword.toLowerCase();
    return this.tasks.filter((t) =>
      t.content.toLowerCase().includes(lowerKeyword),
    );
  }

  /**
   * 导航到块
   */
  async navigateToBlock(blockId: string): Promise<boolean> {
    try {
      // 如果是手动添加的任务，不需要跳转
      if (blockId.startsWith("manual-")) {
        console.warn("手动添加的任务没有关联的笔记块");
        return false;
      }

      const blockInfo = await this.storageService.getBlockInfo(blockId);
      if (!blockInfo || !blockInfo.exists) {
        console.warn("原始笔记内容已不存在");
        return false;
      }

      await this.storageService.openBlock(blockId);
      return true;
    } catch (error) {
      console.error("跳转失败:", error);
      return false;
    }
  }

  /**
   * 生成UUID
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

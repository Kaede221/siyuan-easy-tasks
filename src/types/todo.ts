/**
 * Todo Plugin Type Definitions
 */

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  TODO = 'todo',
  COMPLETED = 'completed'
}

/**
 * 任务接口
 */
export interface Task {
  id: string              // 任务唯一标识符 (UUID)
  content: string         // 任务文本内容
  blockId: string         // 关联的思源笔记Block ID
  status: TaskStatus      // 任务状态
  createdAt: number       // 创建时间戳 (毫秒)
  completedAt?: number    // 完成时间戳 (毫秒，可选)
}

/**
 * 任务过滤器接口
 */
export interface TaskFilter {
  status?: TaskStatus     // 按状态过滤 (可选)
  keyword?: string        // 搜索关键词 (可选)
}

/**
 * 块信息接口
 */
export interface BlockInfo {
  id: string              // Block ID
  content: string         // 块内容
  type: string            // 块类型
  exists: boolean         // 块是否存在
}

/**
 * 存储数据接口
 */
export interface StorageData {
  version: string         // 数据版本
  tasks: Task[]           // 任务列表
  lastModified: number    // 最后修改时间
}

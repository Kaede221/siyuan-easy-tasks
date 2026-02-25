/**
 * StorageService - 数据访问层
 * 处理数据持久化和思源API交互
 */

import type { Plugin } from 'siyuan'
import type { Task, BlockInfo, StorageData } from '@/types/todo'
import { openTab } from 'siyuan'

export class StorageService {
  private plugin: Plugin
  private readonly STORAGE_KEY = 'tasks'
  private readonly DATA_VERSION = '1.0.0'

  constructor(plugin: Plugin) {
    this.plugin = plugin
  }

  /**
   * 保存任务列表到存储
   */
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const data: StorageData = {
        version: this.DATA_VERSION,
        tasks,
        lastModified: Date.now()
      }
      await this.setPluginData(this.STORAGE_KEY, data)
    } catch (error) {
      console.error('保存任务数据失败:', error)
      throw error
    }
  }

  /**
   * 从存储加载任务列表
   */
  async loadTasks(): Promise<Task[]> {
    try {
      const data = await this.getPluginData(this.STORAGE_KEY)
      if (!data || !data.tasks) {
        return []
      }
      return this.validateAndParseTasks(data.tasks)
    } catch (error) {
      console.error('加载任务数据失败:', error)
      return []
    }
  }

  /**
   * 获取块信息
   */
  async getBlockInfo(blockId: string): Promise<BlockInfo | null> {
    try {
      const result = await this.callSiyuanAPI(async () => {
        const response = await fetch('/api/block/getBlockInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: blockId })
        })
        return await response.json()
      })

      if (result && result.code === 0 && result.data) {
        return {
          id: blockId,
          content: result.data.content || '',
          type: result.data.type || '',
          exists: true
        }
      }
      return null
    } catch (error) {
      console.error('获取块信息失败:', error)
      return null
    }
  }

  /**
   * 打开并定位到指定块
   */
  async openBlock(blockId: string): Promise<boolean> {
    try {
      // 使用思源的 openTab 方法打开块
      openTab({
        app: this.plugin.app,
        doc: {
          id: blockId,
          action: ['cb-get-focus']  // 聚焦到该块
        }
      })

      return true
    } catch (error) {
      console.error('打开块失败:', error)
      return false
    }
  }

  /**
   * 获取插件数据
   */
  async getPluginData(key: string): Promise<any> {
    return await this.plugin.loadData(key)
  }

  /**
   * 设置插件数据
   */
  async setPluginData(key: string, value: any): Promise<void> {
    await this.plugin.saveData(key, value)
  }

  /**
   * 验证并解析任务数据
   */
  private validateAndParseTasks(rawTasks: any[]): Task[] {
    const validTasks: Task[] = []
    const invalidTasks: any[] = []

    for (const task of rawTasks) {
      try {
        // 验证必需字段
        if (!task.id || !task.content || !task.blockId || !task.status) {
          throw new Error('缺少必需字段')
        }

        // 验证字段格式
        if (!this.isValidUUID(task.id)) {
          throw new Error('无效的任务ID')
        }

        if (!this.isValidBlockId(task.blockId)) {
          throw new Error('无效的Block ID')
        }

        validTasks.push(task as Task)
      } catch (error) {
        console.warn('跳过无效任务:', task, error)
        invalidTasks.push(task)
      }
    }

    if (invalidTasks.length > 0) {
      console.warn(`${invalidTasks.length} 个任务数据无效已被跳过`)
    }

    return validTasks
  }

  /**
   * 验证UUID格式
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  /**
   * 验证思源Block ID格式
   */
  private isValidBlockId(blockId: string): boolean {
    // 思源Block ID格式: 20位时间戳-7位随机字符
    const blockIdRegex = /^\d{14}-[a-z0-9]{7}$/
    // 手动添加的任务使用 manual- 前缀
    const manualIdRegex = /^manual-/
    return blockIdRegex.test(blockId) || manualIdRegex.test(blockId)
  }

  /**
   * 调用思源API（带重试机制）
   */
  private async callSiyuanAPI<T>(
    apiCall: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await apiCall()
      } catch (error) {
        if (i === retries - 1) {
          throw error
        }
        // 指数退避: 100ms, 200ms, 400ms
        await this.sleep(100 * Math.pow(2, i))
      }
    }
    throw new Error('API调用失败')
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

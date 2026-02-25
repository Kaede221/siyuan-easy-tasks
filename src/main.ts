import {
  Plugin,
} from "siyuan";
import { createApp, App as VueApp } from 'vue'
import App from './App.vue'
import { StorageService } from './services/StorageService'
import { TaskManager } from './services/TaskManager'
import { showNotification } from './utils/notification'

let plugin: Plugin | null = null
let storageService: StorageService | null = null
let taskManager: TaskManager | null = null

export function usePlugin(pluginProps?: Plugin): Plugin {
  if (pluginProps) {
    plugin = pluginProps
  }
  if (!plugin && !pluginProps) {
    console.error('need bind plugin')
  }
  return plugin as Plugin
}

export function getTaskManager(): TaskManager {
  if (!taskManager) {
    throw new Error('TaskManager not initialized')
  }
  return taskManager
}

export function getStorageService(): StorageService {
  if (!storageService) {
    throw new Error('StorageService not initialized')
  }
  return storageService
}

let app: VueApp | null = null
export async function init(pluginInstance: Plugin) {
  // bind plugin hook
  usePlugin(pluginInstance)

  // 初始化服务
  storageService = new StorageService(pluginInstance)
  taskManager = new TaskManager(storageService)

  // 加载任务数据
  try {
    await taskManager.initialize()
  } catch (error) {
    console.error('初始化任务数据失败:', error)
    showNotification('任务数据加载失败', 'error')
  }

  // 创建 Vue 应用
  const div = document.createElement('div')
  div.classList.add('siyuan-easy-tasks-app')
  div.id = 'siyuan-easy-tasks'
  app = createApp(App)
  app.mount(div)
  document.body.appendChild(div)
}

export function destroy() {
  if (app) {
    app.unmount()
  }
  const div = document.getElementById('siyuan-easy-tasks')
  if (div) {
    document.body.removeChild(div)
  }

  // 清理服务
  taskManager = null
  storageService = null
  plugin = null
}


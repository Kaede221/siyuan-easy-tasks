/**
 * 通知和错误处理工具
 */

type NotificationType = 'info' | 'success' | 'warning' | 'error'

/**
 * 显示通知
 */
export function showNotification(message: string, type: NotificationType = 'info'): void {
  // 使用思源笔记的通知API
  if (window.siyuan) {
    const siyuan = window.siyuan as any
    if (siyuan.showMessage) {
      siyuan.showMessage(message, -1, type)
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`)
    }
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`)
  }
}

/**
 * 记录错误日志
 */
export function logError(
  type: string,
  message: string,
  error: Error,
  context?: any
): void {
  console.error({
    timestamp: new Date().toISOString(),
    type,
    message,
    error: error.message,
    stack: error.stack,
    context
  })
}

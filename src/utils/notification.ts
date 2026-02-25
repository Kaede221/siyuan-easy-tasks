/**
 * 通知和错误处理工具
 */

import { pushMsg, pushErrMsg } from "@/api";

type NotificationType = "info" | "success" | "warning" | "error";

/**
 * 显示通知
 */
export async function showNotification(
  message: string,
  type: NotificationType = "info",
  timeout: number = 7000,
): Promise<void> {
  try {
    // 使用思源笔记的通知API
    if (type === "error") {
      await pushErrMsg(message, timeout);
    } else {
      await pushMsg(message, timeout);
    }
  } catch (error) {
    console.error("显示通知失败:", error);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * 记录错误日志
 */
export function logError(
  type: string,
  message: string,
  error: Error,
  context?: any,
): void {
  console.error({
    timestamp: new Date().toISOString(),
    type,
    message,
    error: error.message,
    stack: error.stack,
    context,
  });
}

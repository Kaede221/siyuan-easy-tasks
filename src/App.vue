<template>
  <div class="plugin-app-main">
    <!-- Todo Panel -->
    <Transition name="panel">
      <div
        v-if="showTodoPanel"
        class="todo-panel-container"
      >
        <Transition name="backdrop">
          <div
            v-if="showTodoPanel"
            class="todo-panel-backdrop"
            @click="closeTodoPanel"
          ></div>
        </Transition>
        <Transition name="wrapper">
          <div
            v-if="showTodoPanel"
            class="todo-panel-wrapper"
          >
            <div class="todo-panel-header">
              <h2>{{ i18n.todoPlugin }}</h2>
              <button class="close-btn" @click="closeTodoPanel">×</button>
            </div>
            <TodoPanel
              :tasks="tasks"
              :i18n="i18n"
              @status-change="handleStatusChange"
              @delete="handleDelete"
              @navigate="handleNavigate"
              @batch-delete-completed="handleBatchDeleteCompleted"
              @add-task="handleAddTaskManually"
              @edit-task="handleEditTask"
            />
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { usePlugin, getTaskManager } from "@/main";
import TodoPanel from "@/components/Todo/TodoPanel.vue";
import type { Task, TaskStatus } from "@/types/todo";
import { showNotification } from "@/utils/notification";

const plugin = usePlugin();
const taskManager = getTaskManager();

const showTodoPanel = ref(false);
const tasks = ref<Task[]>([]);

// 国际化
const i18n = computed(() => {
  return plugin.i18n as Record<string, string>;
});

// 打开 Todo 面板
const openTodoPanel = () => {
  showTodoPanel.value = true;
  refreshTasks();
};

// 关闭 Todo 面板
const closeTodoPanel = () => {
  showTodoPanel.value = false;
};

// 刷新任务列表
const refreshTasks = () => {
  tasks.value = [...taskManager.getAllTasks()];
};

// 处理状态变更
const handleStatusChange = async (taskId: string, status: TaskStatus) => {
  try {
    await taskManager.updateTaskStatus(taskId, status);
    refreshTasks();

    const message =
      status === "completed"
        ? i18n.value.taskCompleted
        : i18n.value.taskUncompleted;
    await showNotification(message, "success");
  } catch (error) {
    console.error("更新任务状态失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

// 处理删除
const handleDelete = async (taskId: string) => {
  try {
    await taskManager.deleteTask(taskId);
    refreshTasks();

    await showNotification(i18n.value.taskDeleted, "success");
  } catch (error) {
    console.error("删除任务失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

// 处理导航
const handleNavigate = async (blockId: string) => {
  const success = await taskManager.navigateToBlock(blockId);
  if (!success) {
    await showNotification(i18n.value.blockNotFound, "warning");
  }
};

// 处理批量删除已完成任务
const handleBatchDeleteCompleted = async () => {
  try {
    await taskManager.batchDeleteCompleted();
    refreshTasks();

    await showNotification(i18n.value.taskDeleted, "success");
  } catch (error) {
    console.error("批量删除失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

// 添加任务（从右键菜单调用）
const addTaskFromSelection = async (content: string, blockId: string, isManual: boolean = false) => {
  try {
    await taskManager.addTask(content, blockId, undefined, isManual);
    refreshTasks();

    await showNotification(i18n.value.taskAdded, "success");
  } catch (error) {
    console.error("添加任务失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

// 手动添加任务（从弹窗输入框）
const handleAddTaskManually = async (content: string, note?: string) => {
  try {
    const manualBlockId = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await taskManager.addTask(content, manualBlockId, note, true);
    refreshTasks();

    await showNotification(i18n.value.taskAdded, "success");
  } catch (error) {
    console.error("添加任务失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

// 编辑任务
const handleEditTask = async (taskId: string, updates: { content: string; note?: string }) => {
  try {
    await taskManager.updateTask(taskId, updates);
    refreshTasks();

    await showNotification(i18n.value.taskUpdated, "success");
  } catch (error) {
    console.error("更新任务失败:", error);
    await showNotification(i18n.value.saveFailed, "error");
  }
};

onMounted(() => {
  // 添加顶部栏图标
  plugin.addTopBar({
    icon: "iconList",
    title: i18n.value.todoPlugin,
    callback: () => {
      openTodoPanel();
    },
  });

  // 暴露全局方法供插件使用
  window._sy_plugin_sample = {
    openTodoPanel,
    closeTodoPanel,
    addTaskFromSelection,
  };
});
</script>

<style lang="scss" scoped>
.plugin-app-main {
  width: 100%;
  height: 100%;
  max-height: 100vh;
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
}

.todo-panel-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: auto;
}

.todo-panel-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.todo-panel-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  height: 80%;
  max-height: 600px;
  background-color: var(--b3-theme-background);
  border-radius: var(--b3-border-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.todo-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--b3-border-color);
  background-color: var(--b3-theme-surface);

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--b3-theme-on-background);
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    color: var(--b3-theme-on-surface);
    border-radius: var(--b3-border-radius);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--b3-list-hover);
    }
  }
}
</style>

<style lang="scss">
.siyuan-easy-tasks-app {
  width: 100vw;
  height: 100dvh;
  max-height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
  box-sizing: border-box;
}

/* Vue Transition 动画 */
/* 面板容器动画 */
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

/* 背景遮罩动画 */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* 面板主体动画 */
.wrapper-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wrapper-leave-active {
  transition: all 0.3s ease-in;
}

.wrapper-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.wrapper-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}
</style>

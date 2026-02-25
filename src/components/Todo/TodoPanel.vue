<template>
  <div class="todo-panel">
    <!-- 搜索和操作按钮 -->
    <div class="todo-panel__filter">
      <SyInput
        :model-value="filter.keyword || ''"
        :placeholder="i18n.searchPlaceholder"
        @update:model-value="handleKeywordChange"
      />
      <button
        class="add-task-btn"
        :title="i18n.addTask"
        @click="handleOpenAddDialog"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
          />
        </svg>
      </button>
      <SyButton
        v-if="hasCompletedTasks"
        size="small"
        type="danger"
        @click="handleBatchDelete"
      >
        {{ i18n.batchDeleteCompleted }}
      </SyButton>
    </div>

    <div class="todo-panel__content">
      <div v-if="filteredTasks.length === 0" class="todo-panel__empty">
        {{
          filter.keyword || filter.status
            ? i18n.noMatchResults
            : i18n.emptyState
        }}
      </div>

      <div v-else class="todo-panel__list">
        <TaskItem
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          :i18n="i18n"
          @status-change="handleStatusChange"
          @delete="handleDelete"
          @edit="handleEdit"
          @navigate="handleNavigate"
        />
      </div>
    </div>

    <!-- 任务弹窗（添加/编辑） -->
    <TaskDialog
      v-if="showTaskDialog"
      :task="editingTask"
      :i18n="i18n"
      @save="handleSaveTask"
      @cancel="handleCancelDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  Task,
  TaskFilter as TaskFilterType,
  TaskStatus,
} from "@/types/todo";
import TaskItem from "./TaskItem.vue";
import TaskDialog from "./TaskEditDialog.vue";
import SyButton from "@/components/SiyuanTheme/SyButton.vue";
import SyInput from "@/components/SiyuanTheme/SyInput.vue";

interface Props {
  tasks: Task[];
  i18n: Record<string, string>;
}

interface Emits {
  (e: "statusChange", taskId: string, status: TaskStatus): void;
  (e: "delete", taskId: string): void;
  (e: "navigate", blockId: string): void;
  (e: "batchDeleteCompleted"): void;
  (e: "addTask", content: string, note?: string): void;
  (
    e: "editTask",
    taskId: string,
    updates: { content: string; note?: string },
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filter = ref<TaskFilterType>({});
const editingTask = ref<Task | null>(null);
const showTaskDialog = ref(false);

// 处理关键词变化
const handleKeywordChange = (keyword: string) => {
  filter.value.keyword = keyword || undefined;
};

// 过滤任务
const filteredTasks = computed(() => {
  let result = [...props.tasks];

  // 按状态过滤
  if (filter.value.status) {
    result = result.filter((t) => t.status === filter.value.status);
  }

  // 按关键词搜索
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase();
    result = result.filter((t) => t.content.toLowerCase().includes(keyword));
  }

  return result;
});

// 按状态和创建时间排序
const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort((a, b) => {
    // 首先按状态排序：待完成的任务在前，已完成的在后
    if (a.status !== b.status) {
      return a.status === "todo" ? -1 : 1;
    }
    // 相同状态下，按创建时间倒序排序（新的在前）
    return b.createdAt - a.createdAt;
  });
});

// 是否有已完成的任务
const hasCompletedTasks = computed(() => {
  return props.tasks.some((t) => t.status === "completed");
});

const handleOpenAddDialog = () => {
  editingTask.value = null;
  showTaskDialog.value = true;
};

const handleEdit = (taskId: string) => {
  const task = props.tasks.find((t) => t.id === taskId);
  if (task) {
    editingTask.value = task;
    showTaskDialog.value = true;
  }
};

const handleSaveTask = (updates: { content: string; note?: string }) => {
  if (editingTask.value) {
    // 编辑模式
    emit("editTask", editingTask.value.id, updates);
  } else {
    // 添加模式
    emit("addTask", updates.content, updates.note);
  }
  handleCancelDialog();
};

const handleCancelDialog = () => {
  showTaskDialog.value = false;
  editingTask.value = null;
};

const handleStatusChange = (taskId: string, status: TaskStatus) => {
  emit("statusChange", taskId, status);
};

const handleDelete = (taskId: string) => {
  if (confirm(props.i18n.deleteConfirm)) {
    emit("delete", taskId);
  }
};

const handleNavigate = (blockId: string) => {
  emit("navigate", blockId);
};

const handleBatchDelete = () => {
  if (confirm(props.i18n.batchDeleteConfirm)) {
    emit("batchDeleteCompleted");
  }
};
</script>

<style scoped lang="scss">
.todo-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--b3-theme-background);

  &__filter {
    display: flex;
    align-items: stretch;
    gap: 8px;
    padding: 12px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--b3-border-color);
    background-color: var(--b3-theme-background);

    > :first-child {
      flex: 1;
    }

    .add-task-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 1px solid var(--b3-theme-primary);
      background: var(--b3-theme-primary);
      color: var(--b3-theme-on-primary);
      cursor: pointer;
      border-radius: var(--b3-border-radius);
      transition: all 0.2s;
      flex-shrink: 0;

      &:hover {
        opacity: 0.85;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      svg {
        display: block;
      }
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--b3-theme-on-surface-light);
    font-size: 14px;
  }

  &__list {
    // 任务列表容器
  }
}
</style>

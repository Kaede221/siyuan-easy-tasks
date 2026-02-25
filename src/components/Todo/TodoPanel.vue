<template>
  <div class="todo-panel">
    <!-- 添加任务输入区 -->
    <div class="todo-panel__add-task">
      <Transition name="fade-scale" mode="out-in">
        <div
          v-if="!showAddTaskForm"
          key="trigger"
          class="add-task-trigger"
        >
          <SyButton type="primary" @click="toggleAddTaskForm(true)">
            {{ i18n.addTask }}
          </SyButton>
        </div>
        <div
          v-else
          key="form"
          class="add-task-form"
        >
          <SyInput
            v-model="newTaskContent"
            :placeholder="i18n.addTaskPlaceholder"
            @keyup.enter="handleAddTask"
          />
          <SyTextarea
            v-model="newTaskNote"
            :placeholder="i18n.taskNotePlaceholder"
            :rows="2"
          />
          <div class="add-task-actions">
            <SyButton @click="toggleAddTaskForm(false)">{{ i18n.cancel }}</SyButton>
            <SyButton type="primary" @click="handleAddTask">
              {{ i18n.confirm }}
            </SyButton>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 搜索和批量操作 -->
    <div class="todo-panel__filter">
      <SyInput
        :model-value="filter.keyword || ''"
        :placeholder="i18n.searchPlaceholder"
        @update:model-value="handleKeywordChange"
      />
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
        />
      </div>
    </div>

    <!-- 编辑任务弹窗 -->
    <TaskEditDialog
      v-if="editingTask"
      :task="editingTask"
      :i18n="i18n"
      @save="handleSaveEdit"
      @cancel="handleCancelEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Transition } from "vue";
import type {
  Task,
  TaskFilter as TaskFilterType,
  TaskStatus,
} from "@/types/todo";
import TaskItem from "./TaskItem.vue";
import TaskEditDialog from "./TaskEditDialog.vue";
import SyButton from "@/components/SiyuanTheme/SyButton.vue";
import SyInput from "@/components/SiyuanTheme/SyInput.vue";
import SyTextarea from "@/components/SiyuanTheme/SyTextarea.vue";

interface Props {
  tasks: Task[];
  i18n: Record<string, string>;
}

interface Emits {
  (e: "statusChange", taskId: string, status: TaskStatus): void;
  (e: "delete", taskId: string): void;
  (e: "batchDeleteCompleted"): void;
  (e: "addTask", content: string, note?: string): void;
  (e: "editTask", taskId: string, updates: { content: string; note?: string }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filter = ref<TaskFilterType>({});
const newTaskContent = ref("");
const newTaskNote = ref("");
const editingTask = ref<Task | null>(null);
const showAddTaskForm = ref(false);

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
      return a.status === 'todo' ? -1 : 1;
    }
    // 相同状态下，按创建时间倒序排序（新的在前）
    return b.createdAt - a.createdAt;
  });
});

// 是否有已完成的任务
const hasCompletedTasks = computed(() => {
  return props.tasks.some((t) => t.status === "completed");
});

const handleAddTask = () => {
  const content = newTaskContent.value.trim();
  if (content) {
    const note = newTaskNote.value.trim() || undefined;
    emit("addTask", content, note);
    newTaskContent.value = "";
    newTaskNote.value = "";
    showAddTaskForm.value = false;
  }
};

const toggleAddTaskForm = (show: boolean) => {
  showAddTaskForm.value = show;
};

const handleEdit = (taskId: string) => {
  const task = props.tasks.find(t => t.id === taskId);
  if (task) {
    editingTask.value = task;
  }
};

const handleSaveEdit = (updates: { content: string; note?: string }) => {
  if (editingTask.value) {
    emit("editTask", editingTask.value.id, updates);
    editingTask.value = null;
  }
};

const handleCancelEdit = () => {
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

  &__add-task {
    padding: 16px;
    border-bottom: 1px solid var(--b3-border-color);
    background-color: var(--b3-theme-surface);

    .add-task-trigger {
      display: flex;
      justify-content: center;
    }

    .add-task-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;

      // 强制输入框和文本域占满宽度
      :deep(input.b3-text-field),
      :deep(textarea.b3-text-field) {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
      }

      .add-task-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
    }
  }

  // Transition 动画
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
  }

  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  &__filter {
    display: flex;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--b3-border-color);
    background-color: var(--b3-theme-background);

    > :first-child {
      flex: 1;
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

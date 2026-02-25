<template>
  <div
    :class="['task-item', `task-item--${task.status}`]"
    :style="{ viewTransitionName: `task-item-${task.id}` }"
  >
    <div class="task-item__checkbox">
      <SyCheckbox
        :model-value="task.status === 'completed'"
        @update:model-value="handleStatusChange"
      />
    </div>

    <div class="task-item__content">
      <!-- 如果是从笔记添加的任务，标题显示为可点击的链接 -->
      <div
        v-if="!task.isManual"
        class="task-item__text task-item__text--link"
        @click="handleNavigate"
        :title="i18n.jumpToSource"
      >
        {{ task.content }}
      </div>
      <!-- 如果是手动添加的任务，标题显示为普通文本 -->
      <div v-else class="task-item__text">{{ task.content }}</div>

      <div v-if="task.note" class="task-item__note">
        {{ task.note }}
      </div>
      <div class="task-item__meta">
        <span class="task-item__time">
          {{ i18n.createdAt }}: {{ formatTime(task.createdAt) }}
        </span>
        <span v-if="task.completedAt" class="task-item__time">
          {{ i18n.completedAt }}: {{ formatTime(task.completedAt) }}
        </span>
        <span v-if="task.updatedAt" class="task-item__time">
          {{ i18n.updatedAt }}: {{ formatTime(task.updatedAt) }}
        </span>
      </div>
    </div>

    <div class="task-item__actions">
      <!-- 所有任务都显示编辑按钮，但从笔记添加的任务只能编辑备注 -->
      <button
        class="task-item__edit"
        :title="i18n.editTask"
        @click="handleEdit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
          />
        </svg>
      </button>
      <button
        class="task-item__delete"
        :title="i18n.deleteTask"
        @click="handleDelete"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M6.5 1h3a.5.5 0 0 1 .5.5V2h-4v-.5a.5.5 0 0 1 .5-.5ZM11 2v-.5A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5V2H2.5a.5.5 0 0 0 0 1h.5v10.5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V3h.5a.5.5 0 0 0 0-1H11ZM4 3h8v10.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V3Zm2.5 2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5Zm3 0a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "@/types/todo";
import SyCheckbox from "@/components/SiyuanTheme/SyCheckbox.vue";

interface Props {
  task: Task;
  i18n: Record<string, string>;
}

interface Emits {
  (e: "statusChange", taskId: string, status: "todo" | "completed"): void;
  (e: "delete", taskId: string): void;
  (e: "edit", taskId: string): void;
  (e: "navigate", blockId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleStatusChange = (checked: boolean) => {
  const newStatus = checked ? "completed" : "todo";
  emit("statusChange", props.task.id, newStatus);
};

const handleEdit = () => {
  emit("edit", props.task.id);
};

const handleDelete = () => {
  emit("delete", props.task.id);
};

const handleNavigate = () => {
  emit("navigate", props.task.blockId);
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
</script>

<style scoped lang="scss">
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--b3-border-color);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--b3-list-hover);
  }

  &--completed {
    opacity: 0.6;

    .task-item__text {
      text-decoration: line-through;
      color: var(--b3-theme-on-surface);
    }
  }

  &__checkbox {
    flex-shrink: 0;
    padding-top: 2px;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__text {
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    margin-bottom: 4px;

    &--link {
      color: var(--b3-theme-primary);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        text-decoration: underline;
        opacity: 0.8;
      }

      &:active {
        opacity: 0.6;
      }
    }
  }

  &__note {
    font-size: 13px;
    line-height: 1.4;
    color: var(--b3-theme-on-surface-light);
    word-break: break-word;
    margin-bottom: 4px;
    padding: 6px 8px;
    background-color: var(--b3-theme-surface);
    border-radius: 4px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: var(--b3-theme-on-surface-light);
  }

  &__time {
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &__edit,
  &__delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--b3-theme-on-surface);
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: var(--b3-list-hover);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      display: block;
    }
  }

  &__edit:hover {
    color: var(--b3-theme-primary);
  }

  &__delete:hover {
    color: var(--b3-card-error-color);
  }
}
</style>

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
      <div class="task-item__text">{{ task.content }}</div>
      <div class="task-item__meta">
        <span class="task-item__time">
          {{ i18n.createdAt }}: {{ formatTime(task.createdAt) }}
        </span>
        <span v-if="task.completedAt" class="task-item__time">
          {{ i18n.completedAt }}: {{ formatTime(task.completedAt) }}
        </span>
      </div>
    </div>

    <div class="task-item__actions">
      <SyButton
        class="task-item__jump"
        size="small"
        @click="handleNavigate"
      >
        {{ i18n.jumpToSource }}
      </SyButton>
      <SyButton
        class="task-item__delete"
        size="small"
        type="danger"
        @click="handleDelete"
      >
        {{ i18n.deleteTask }}
      </SyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/todo'
import SyCheckbox from '@/components/SiyuanTheme/SyCheckbox.vue'
import SyButton from '@/components/SiyuanTheme/SyButton.vue'

interface Props {
  task: Task
  i18n: Record<string, string>
}

interface Emits {
  (e: 'statusChange', taskId: string, status: 'todo' | 'completed'): void
  (e: 'delete', taskId: string): void
  (e: 'navigate', blockId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleStatusChange = (checked: boolean) => {
  const newStatus = checked ? 'completed' : 'todo'
  emit('statusChange', props.task.id, newStatus)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}

const handleNavigate = () => {
  emit('navigate', props.task.blockId)
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
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

  &__jump,
  &__delete {
    font-size: 12px;
  }
}
</style>

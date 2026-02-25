<template>
  <div class="task-filter">
    <div class="task-filter__search">
      <SyInput
        :model-value="modelValue.keyword || ''"
        :placeholder="i18n.searchPlaceholder"
        @update:model-value="handleKeywordChange"
      />
    </div>

    <div class="task-filter__status">
      <SySelect
        :model-value="modelValue.status || 'all'"
        @update:model-value="handleStatusChange"
      >
        <option value="all">{{ i18n.allTasks }}</option>
        <option value="todo">{{ i18n.todoTasks }}</option>
        <option value="completed">{{ i18n.completedTasks }}</option>
      </SySelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskFilter } from '@/types/todo.d.ts'
import SyInput from '@/components/SiyuanTheme/SyInput.vue'
import SySelect from '@/components/SiyuanTheme/SySelect.vue'

interface Props {
  modelValue: TaskFilter
  i18n: Record<string, string>
}

interface Emits {
  (e: 'update:modelValue', value: TaskFilter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleKeywordChange = (keyword: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    keyword: keyword || undefined
  })
}

const handleStatusChange = (status: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    status: status === 'all' ? undefined : status as any
  })
}
</script>

<style scoped lang="scss">
.task-filter {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--b3-border-color);
  background-color: var(--b3-theme-background);

  &__search {
    flex: 1;
    min-width: 0;
  }

  &__status {
    flex-shrink: 0;
    min-width: 120px;
  }
}
</style>

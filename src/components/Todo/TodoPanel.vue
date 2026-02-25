<template>
  <div class="todo-panel">
    <div class="todo-panel__header">
      <h2 class="todo-panel__title">{{ i18n.taskList }}</h2>
      <SyButton
        v-if="hasCompletedTasks"
        size="small"
        type="danger"
        @click="handleBatchDelete"
      >
        {{ i18n.batchDeleteCompleted }}
      </SyButton>
    </div>

    <!-- 添加任务输入区 -->
    <div class="todo-panel__add-task">
      <SyInput
        v-model="newTaskContent"
        :placeholder="i18n.addTaskPlaceholder"
        @keyup.enter="handleAddTask"
      />
      <SyButton
        type="primary"
        @click="handleAddTask"
      >
        {{ i18n.addTask }}
      </SyButton>
    </div>

    <TaskFilter
      v-model="filter"
      :i18n="i18n"
    />

    <div class="todo-panel__content">
      <div v-if="filteredTasks.length === 0" class="todo-panel__empty">
        {{ filter.keyword || filter.status ? i18n.noMatchResults : i18n.emptyState }}
      </div>

      <div v-else class="todo-panel__list">
        <TaskItem
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          :i18n="i18n"
          @status-change="handleStatusChange"
          @delete="handleDelete"
          @navigate="handleNavigate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskFilter as TaskFilterType, TaskStatus } from '@/types/todo'
import TaskFilter from './TaskFilter.vue'
import TaskItem from './TaskItem.vue'
import SyButton from '@/components/SiyuanTheme/SyButton.vue'
import SyInput from '@/components/SiyuanTheme/SyInput.vue'

interface Props {
  tasks: Task[]
  i18n: Record<string, string>
}

interface Emits {
  (e: 'statusChange', taskId: string, status: TaskStatus): void
  (e: 'delete', taskId: string): void
  (e: 'navigate', blockId: string): void
  (e: 'batchDeleteCompleted'): void
  (e: 'addTask', content: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const filter = ref<TaskFilterType>({})
const newTaskContent = ref('')

// 过滤任务
const filteredTasks = computed(() => {
  let result = [...props.tasks]

  // 按状态过滤
  if (filter.value.status) {
    result = result.filter(t => t.status === filter.value.status)
  }

  // 按关键词搜索
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase()
    result = result.filter(t => t.content.toLowerCase().includes(keyword))
  }

  return result
})

// 按创建时间倒序排序
const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort((a, b) => b.createdAt - a.createdAt)
})

// 是否有已完成的任务
const hasCompletedTasks = computed(() => {
  return props.tasks.some(t => t.status === 'completed')
})

const handleAddTask = () => {
  const content = newTaskContent.value.trim()
  if (content) {
    emit('addTask', content)
    newTaskContent.value = ''
  }
}

const handleStatusChange = (taskId: string, status: TaskStatus) => {
  emit('statusChange', taskId, status)
}

const handleDelete = (taskId: string) => {
  if (confirm(props.i18n.deleteConfirm)) {
    emit('delete', taskId)
  }
}

const handleNavigate = (blockId: string) => {
  emit('navigate', blockId)
}

const handleBatchDelete = () => {
  if (confirm(props.i18n.batchDeleteConfirm)) {
    emit('batchDeleteCompleted')
  }
}
</script>

<style scoped lang="scss">
.todo-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--b3-theme-background);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--b3-border-color);
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--b3-theme-on-background);
  }

  &__add-task {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--b3-border-color);
    background-color: var(--b3-theme-surface);
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

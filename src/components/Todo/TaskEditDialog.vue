<template>
  <div class="task-edit-dialog-backdrop" @click="handleCancel">
    <div class="task-edit-dialog" @click.stop>
      <div class="task-edit-dialog__header">
        <h3>{{ i18n.editTask }}</h3>
        <button class="close-btn" @click="handleCancel">×</button>
      </div>

      <div class="task-edit-dialog__body">
        <div class="form-group">
          <label>{{ i18n.taskContent }}</label>
          <SyTextarea
            v-model="formData.content"
            :placeholder="i18n.taskContentPlaceholder"
            :rows="3"
          />
        </div>

        <div class="form-group">
          <label>{{ i18n.taskNote }}</label>
          <SyTextarea
            v-model="formData.note"
            :placeholder="i18n.taskNotePlaceholder"
            :rows="4"
          />
        </div>
      </div>

      <div class="task-edit-dialog__footer">
        <SyButton @click="handleCancel">{{ i18n.cancel }}</SyButton>
        <SyButton type="primary" @click="handleSave">{{ i18n.save }}</SyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task } from '@/types/todo'
import SyButton from '@/components/SiyuanTheme/SyButton.vue'
import SyTextarea from '@/components/SiyuanTheme/SyTextarea.vue'

interface Props {
  task: Task
  i18n: Record<string, string>
}

interface Emits {
  (e: 'save', updates: { content: string; note?: string }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  content: props.task.content,
  note: props.task.note || ''
})

// 监听task变化，更新表单数据
watch(() => props.task, (newTask) => {
  formData.value = {
    content: newTask.content,
    note: newTask.note || ''
  }
}, { immediate: true })

const handleSave = () => {
  if (!formData.value.content.trim()) {
    return
  }

  emit('save', {
    content: formData.value.content.trim(),
    note: formData.value.note.trim() || undefined
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.task-edit-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.task-edit-dialog {
  background-color: var(--b3-theme-background);
  border-radius: var(--b3-border-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--b3-border-color);

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--b3-theme-on-background);
    }

    .close-btn {
      width: 28px;
      height: 28px;
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

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .form-group {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--b3-theme-on-background);
      }
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid var(--b3-border-color);
  }
}
</style>

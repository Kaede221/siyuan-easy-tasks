<template>
  <div class="task-dialog-backdrop" @click="handleCancel">
    <Transition name="dialog-scale">
      <div v-if="show" class="task-dialog" @click.stop>
        <div class="task-dialog__header">
          <h3>{{ isEdit ? i18n.editTask : i18n.addTask }}</h3>
          <button class="close-btn" @click="handleCancel">×</button>
        </div>

        <div class="task-dialog__body">
          <!-- 只有手动任务或新建任务时才显示内容编辑框 -->
          <div v-if="!task || task.isManual" class="form-group">
            <label>{{ i18n.taskContent }}</label>
            <SyTextarea
              v-model="formData.content"
              :placeholder="i18n.taskContentPlaceholder"
              :rows="3"
            />
          </div>

          <!-- 从笔记添加的任务显示只读的标题 -->
          <div v-else class="form-group">
            <label>{{ i18n.taskContent }}</label>
            <div class="task-content-readonly">
              {{ formData.content }}
            </div>
            <div class="task-content-hint">
              {{ i18n.taskContentReadonlyHint || '此任务来自笔记块，标题不可编辑' }}
            </div>
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

        <div class="task-dialog__footer">
          <SyButton @click="handleCancel">{{ i18n.cancel }}</SyButton>
          <SyButton type="primary" @click="handleSave">{{ i18n.save }}</SyButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { Task } from '@/types/todo'
import SyButton from '@/components/SiyuanTheme/SyButton.vue'
import SyTextarea from '@/components/SiyuanTheme/SyTextarea.vue'

interface Props {
  task?: Task | null
  i18n: Record<string, string>
}

interface Emits {
  (e: 'save', updates: { content: string; note?: string }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const show = ref(false)
const isEdit = ref(false)

const formData = ref({
  content: '',
  note: ''
})

// 监听task变化，更新表单数据
watch(() => props.task, (newTask) => {
  if (newTask) {
    isEdit.value = true
    formData.value = {
      content: newTask.content,
      note: newTask.note || ''
    }
  } else {
    isEdit.value = false
    formData.value = {
      content: '',
      note: ''
    }
  }
}, { immediate: true })

onMounted(() => {
  nextTick(() => {
    show.value = true
  })
})

const handleSave = () => {
  if (!formData.value.content.trim()) {
    return
  }

  // 如果是从笔记添加的任务，只更新备注，不更新内容
  if (props.task && !props.task.isManual) {
    emit('save', {
      content: props.task.content, // 保持原内容不变
      note: formData.value.note.trim() || undefined
    })
  } else {
    emit('save', {
      content: formData.value.content.trim(),
      note: formData.value.note.trim() || undefined
    })
  }
}

const handleCancel = () => {
  show.value = false
  setTimeout(() => {
    emit('cancel')
  }, 250) // 等待动画完成
}
</script>

<style scoped lang="scss">
.task-dialog-backdrop {
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
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.task-dialog {
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

      :deep(textarea.b3-text-field) {
        width: 100%;
        box-sizing: border-box;
      }
    }

    .task-content-readonly {
      padding: 8px 12px;
      background-color: var(--b3-theme-surface);
      border: 1px solid var(--b3-border-color);
      border-radius: var(--b3-border-radius);
      font-size: 14px;
      line-height: 1.5;
      color: var(--b3-theme-on-surface);
      word-break: break-word;
    }

    .task-content-hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--b3-theme-on-surface-light);
      font-style: italic;
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

// Dialog 动画
.dialog-scale-enter-active,
.dialog-scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.dialog-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

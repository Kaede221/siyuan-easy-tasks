<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="visible"
        class="sy-confirm-overlay"
        @click="handleOverlayClick"
      >
        <Transition name="dialog-zoom">
          <div v-if="visible" class="sy-confirm-dialog" @click.stop>
            <div class="sy-confirm-dialog__header">
              <h3 class="sy-confirm-dialog__title">{{ title }}</h3>
            </div>

            <div class="sy-confirm-dialog__content">
              {{ message }}
            </div>

            <div class="sy-confirm-dialog__footer">
              <SyButton @click="handleCancel">
                {{ cancelText }}
              </SyButton>
              <SyButton type="primary" @click="handleConfirm">
                {{ confirmText }}
              </SyButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SyButton from "./SyButton.vue";

interface Props {
  modelValue: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "确认",
  confirmText: "确定",
  cancelText: "取消",
});

const emit = defineEmits<Emits>();

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  },
);

const handleConfirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};

const handleCancel = () => {
  emit("cancel");
  emit("update:modelValue", false);
};

const handleOverlayClick = () => {
  handleCancel();
};
</script>

<style scoped lang="scss">
.sy-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.sy-confirm-dialog {
  background: var(--b3-theme-background);
  border-radius: var(--b3-border-radius-b);
  box-shadow: var(--b3-dialog-shadow);
  min-width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--b3-border-color);
  }

  &__icon {
    font-size: 24px;
    color: var(--b3-theme-primary);
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--b3-theme-on-background);
  }

  &__content {
    padding: 24px;
    color: var(--b3-theme-on-surface);
    font-size: 14px;
    line-height: 1.6;
    flex: 1;
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px 20px;
    border-top: 1px solid var(--b3-border-color);
  }
}

/* 遮罩层淡入淡出动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* 对话框缩放动画 */
.dialog-zoom-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.dialog-zoom-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(-20px);
}

.dialog-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

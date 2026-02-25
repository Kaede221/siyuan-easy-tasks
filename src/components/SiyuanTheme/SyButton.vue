<template>
  <button :class="buttonClasses" :disabled="disabled">
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?: "default" | "primary" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "outline",
  size: "medium",
  disabled: false,
});

const buttonClasses = computed(() => {
  const classes = ["b3-button", "fn__flex-center"];

  // 类型样式
  switch (props.type) {
    case "primary":
      // 主要按钮 - 使用主题色
      break;
    case "danger":
      classes.push("b3-button--cancel");
      break;
    case "outline":
    case "default":
    default:
      classes.push("b3-button--outline");
      break;
  }

  // 尺寸样式
  switch (props.size) {
    case "small":
      classes.push("fn__size200");
      break;
    case "large":
      classes.push("fn__size400");
      break;
    case "medium":
    default:
      classes.push("fn__size200");
      break;
  }

  return classes;
});
</script>

<style scoped lang="scss">
.b3-button {
  &:not(.b3-button--outline):not(.b3-button--cancel) {
    background-color: var(--b3-theme-primary);
    color: var(--b3-theme-on-primary);
    border: 1px solid var(--b3-theme-primary);

    &:hover:not(:disabled) {
      background-color: var(--b3-theme-primary-light);
      border-color: var(--b3-theme-primary-light);
    }

    &:active:not(:disabled) {
      background-color: var(--b3-theme-primary-dark);
      border-color: var(--b3-theme-primary-dark);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

/**
 * 有动画的执行某一个方法
 * @param func 影响到DOM的函数
 */
export const transitionInvoke = (func: () => void | (() => Promise<void>)) => {
  if (document.startViewTransition) {
    document.startViewTransition(func);
  } else {
    func();
  }
};

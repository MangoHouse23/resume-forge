// 响应式视图：根据视口宽度在桌面端 / 移动端之间切换
import { ref } from 'vue'

const BREAKPOINT = 768

function detect(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`).matches
}

const isMobile = ref(detect())

let bound = false

export function useIsMobile() {
  if (!bound && typeof window !== 'undefined') {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const update = () => {
      isMobile.value = mq.matches
    }
    // 兜底：窗口 resize 时候再检测一次（部分旧内核 change 事件不稳）
    window.addEventListener('resize', update)
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', update)
    bound = true
  }
  return isMobile
}
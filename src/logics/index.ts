import dayjs from 'dayjs'
import { useDark } from '@vueuse/core'

export const isDark = useDark()

export function formatDate(d: string | Date) {
  return dayjs(d).format('ll')
}

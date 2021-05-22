import dayjs from 'dayjs'
import { useDark } from '@vueuse/core'

export const isDark = useDark()

export function formatDate(d: string | Date) {
  const date = dayjs(d)
  if (date.year() === dayjs().year())
    return date.format('MMM D')
  return date.format('MMM D, YYYY')
}

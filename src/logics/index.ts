import dayjs from 'dayjs'

export const isDark = useDark()
export const englishOnly = useStorage('antfu-english-only', false)

export function formatDate(d: string | Date) {
  const date = dayjs(d)
  if (date.year() === dayjs().year())
    return date.format('MMM D')
  return date.format('MMM D, YYYY')
}

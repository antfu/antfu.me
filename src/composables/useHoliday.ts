import { getDateInfo } from '@swjs/chinese-holidays'

export interface DayHolidayInfo {
  name: string | null
  isHoliday: boolean // type === 3 法定节假日
  isTransfer: boolean // type === 4 调班
}

// Get holiday info for a specific date
export async function getHolidayInfo(dateStr: string): Promise<DayHolidayInfo> {
  try {
    const info = await getDateInfo(dateStr)
    return {
      name: info.name || null,
      isHoliday: info.type === 3, // 法定节假日
      isTransfer: info.type === 4, // 调班
    }
  }
  catch (e) {
    console.warn('Failed to get holiday info:', e)
    return { name: null, isHoliday: false, isTransfer: false }
  }
}

// Batch get holiday info for multiple dates
export async function getHolidaysForMonth(year: number, month: number): Promise<Record<string, DayHolidayInfo>> {
  const daysInMonth = new Date(year, month, 0).getDate()
  const result: Record<string, DayHolidayInfo> = {}

  // Fetch all dates in parallel
  const promises = []
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    promises.push(
      getHolidayInfo(dateStr).then((info) => {
        result[dateStr] = info
      }),
    )
  }

  await Promise.all(promises)
  return result
}

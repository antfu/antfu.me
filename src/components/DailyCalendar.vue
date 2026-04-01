<script setup lang="ts">
import { formatLunar, toLunar } from 'lunar'
import { type DayHolidayInfo, getHolidaysForMonth } from '../composables/useHoliday'
import { dailyRecords } from '../data/dailiesAuto'

const router = useRouter()

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// Zodiac years
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// Get lunar year info - 格式：农历甲午年 马年
function getLunarYearInfo(year: number, month: number) {
  try {
    const lunar = toLunar({ year, month, day: 1 })
    const zodiac = zodiacs[(lunar.lunar.year - 4) % 12]
    const formatted = formatLunar(lunar.lunar) // 如"农历甲午年二月"
    // 提取天干地支（如"甲午"）
    const ganZhi = formatted.substring(2, 4)
    return `农历${ganZhi}年 ${zodiac}年`
  }
  catch {
    return ''
  }
}

const lunarYearInfo = computed(() => getLunarYearInfo(currentYear.value, currentMonth.value))

// Holiday loading state
const holidaysLoaded = ref(false)
const holidayCache = ref<Record<string, DayHolidayInfo>>({})

async function loadHolidays() {
  holidaysLoaded.value = false
  const holidays = await getHolidaysForMonth(currentYear.value, currentMonth.value)
  holidayCache.value = holidays
  holidaysLoaded.value = true
}

// Lunar month names
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
// Lunar day names
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

// Get lunar info (synchronous, accurate)
function getLunarInfo(dateStr: string) {
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const lunar = toLunar({ year: y, month: m, day: d })
    const monthName = lunarMonths[lunar.lunar.month - 1]
    const dayName = lunarDays[lunar.lunar.day - 1]
    const lunarText = `${monthName}月${dayName}`

    return {
      lunarDay: lunarText,
    }
  }
  catch {
    return { lunarDay: '' }
  }
}

// Solar terms (astronomically calculated, can use fixed dates)
const solarTerms: Record<string, string> = {
  '01-05': '小寒',
  '01-20': '大寒',
  '02-03': '立春',
  '02-18': '雨水',
  '03-05': '惊蛰',
  '03-20': '春分',
  '04-04': '清明',
  '04-05': '谷雨',
  '05-05': '立夏',
  '05-20': '小满',
  '06-05': '芒种',
  '06-21': '夏至',
  '07-06': '小暑',
  '07-22': '大暑',
  '08-07': '立秋',
  '08-22': '处暑',
  '09-07': '白露',
  '09-22': '秋分',
  '10-08': '寒露',
  '10-23': '霜降',
  '11-07': '立冬',
  '11-22': '小雪',
  '12-06': '大雪',
  '12-21': '冬至',
}

// 计算日历网格：42天（6行 x 7列），填充上个月和下个月的日期
const calendarDays = computed(() => {
  const days: { day: number, date: string, year: number, month: number, hasEntry: boolean, isToday: boolean, lunarDay: string, solarTerm: string | null, holidayName: string | null, isHoliday: boolean, isTransfer: boolean, isCurrentMonth: boolean }[] = []

  // 当月的第一天和最后一天
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value, 0)
  const daysInCurrentMonth = lastDayOfMonth.getDate()
  const startWeekday = firstDayOfMonth.getDay() // 0-6

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 上个月需要填充的天数
  const prevMonthDays = startWeekday

  // 上个月
  let prevYear = currentYear.value
  let prevMonth = currentMonth.value - 1
  if (prevMonth < 1) {
    prevMonth = 12
    prevYear--
  }
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate()

  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const lunar = getLunarInfo(dateStr)

    days.push({
      day,
      date: dateStr,
      year: prevYear,
      month: prevMonth,
      hasEntry: dailyRecords.some(r => r.date === dateStr),
      isToday: dateStr === todayStr,
      lunarDay: lunar.lunarDay,
      solarTerm: null,
      holidayName: null,
      isHoliday: false,
      isTransfer: false,
      isCurrentMonth: false,
    })
  }

  // 当月
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const lunar = getLunarInfo(dateStr)
    const holidayInfo = holidayCache.value[dateStr] || { name: null, isHoliday: false, isTransfer: false }

    const monthDay = `${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const solarTerm = solarTerms[monthDay] || null

    days.push({
      day: i,
      date: dateStr,
      year: currentYear.value,
      month: currentMonth.value,
      hasEntry: dailyRecords.some(r => r.date === dateStr),
      isToday: dateStr === todayStr,
      lunarDay: lunar.lunarDay,
      solarTerm,
      holidayName: holidayInfo.name,
      isHoliday: holidayInfo.isHoliday,
      isTransfer: holidayInfo.isTransfer,
      isCurrentMonth: true,
    })
  }

  // 下个月需要填充到的天数（填满42天）
  const remainingDays = 42 - days.length
  let nextYear = currentYear.value
  let nextMonth = currentMonth.value + 1
  if (nextMonth > 12) {
    nextMonth = 1
    nextYear++
  }

  for (let i = 1; i <= remainingDays; i++) {
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const lunar = getLunarInfo(dateStr)

    days.push({
      day: i,
      date: dateStr,
      year: nextYear,
      month: nextMonth,
      hasEntry: dailyRecords.some(r => r.date === dateStr),
      isToday: dateStr === todayStr,
      lunarDay: lunar.lunarDay,
      solarTerm: null,
      holidayName: null,
      isHoliday: false,
      isTransfer: false,
      isCurrentMonth: false,
    })
  }

  return days
})

function prevMonth() {
  let year = currentYear.value
  let month = currentMonth.value - 1
  if (month < 1) {
    month = 12
    year--
  }
  currentYear.value = year
  currentMonth.value = month
  loadHolidays()
}

function nextMonth() {
  let year = currentYear.value
  let month = currentMonth.value + 1
  if (month > 12) {
    month = 1
    year++
  }
  currentYear.value = year
  currentMonth.value = month
  loadHolidays()
}

function selectDay(day: typeof calendarDays.value[0]) {
  if (!day.isCurrentMonth)
    return
  router.push(`/daily/${day.date}`)
}

// Load holidays on mount
onMounted(() => {
  loadHolidays()
})
</script>

<template>
  <div class="daily-calendar-wrapper">
    <div class="daily-calendar">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">
          <div i-ri-arrow-left-s-line />
        </button>
        <div class="header-title">
          <span class="calendar-title">{{ currentYear }}年{{ currentMonth }}月</span>
          <span class="lunar-year">{{ lunarYearInfo }}</span>
        </div>
        <button class="nav-btn" @click="nextMonth">
          <div i-ri-arrow-right-s-line />
        </button>
      </div>

      <div class="calendar-weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>

      <div class="calendar-grid">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day" :class="[
            {
              'has-entry': day.hasEntry && day.isCurrentMonth,
              'is-today': day.isToday,
              'is-holiday': day.isHoliday && day.isCurrentMonth,
              'is-transfer': day.isTransfer && day.isCurrentMonth,
              'is-other-month': !day.isCurrentMonth,
            },
          ]"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.day }}</span>
          <span class="lunar-day">{{ day.lunarDay }}</span>
          <div v-if="day.isHoliday && day.holidayName && day.isCurrentMonth" class="holiday-tag">
            {{ day.holidayName }}
          </div>
          <div v-else-if="day.isTransfer && day.isCurrentMonth" class="transfer-tag">
            调
          </div>
          <div v-else-if="day.solarTerm && day.isCurrentMonth" class="solar-term">
            {{ day.solarTerm }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-calendar-wrapper {
  padding: 2rem 1rem;
}

.daily-calendar {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(252, 252, 252, 0.15);
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  /* border: 1px solid rgba(0, 0, 0, 0.06); */
  /* 固定日历整体高度 */
  /* height: 580px; */
}

.dark .daily-calendar {
  background: rgba(42, 42, 53, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.weekday {
  text-align: center;
  font-size: 1rem;
  opacity: 0.6;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  /* 固定高度：6行日期 + 底部间距 */
  min-height: calc((100% - 2rem) * 0.85);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  font-size: 1.5rem;
}

.nav-btn:hover {
  opacity: 1;
}

.calendar-title {
  font-size: 1.75rem;
  font-weight: 600;
}

.lunar-year {
  font-size: 0.875rem;
  opacity: 0.6;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  font-size: 1rem;
}

.calendar-day:not(.is-other-month):hover {
  background: rgba(128, 128, 128, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.calendar-day.is-other-month {
  cursor: default;
  opacity: 0.35;
}

.calendar-day.is-today {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.calendar-day.has-entry {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
}

.calendar-day.is-holiday {
  background: linear-gradient(135deg, rgba(255, 99, 71, 0.15), rgba(255, 165, 0, 0.15));
  border: 1px solid rgba(255, 99, 71, 0.3);
}

.calendar-day.is-transfer {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.day-number {
  margin-top: 10px;
  font-size: 1.25rem;
  font-weight: 600;
}

.lunar-day {
  opacity: 0.5;
  font-size: 0.625rem;
  margin-top: 2px;
}

.holiday-tag {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.625rem;
  color: #ff6347;
  font-weight: 600;
}

.transfer-tag {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.625rem;
  color: #ffc107;
  font-weight: 600;
}

.solar-term {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.625rem;
  color: #6b8e23;
}
</style>

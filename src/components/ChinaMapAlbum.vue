<script setup lang="ts">
import type { ECharts } from 'echarts'
import * as echarts from 'echarts'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { type InterestImage, travelImages } from '~/data/interestsAuto'

// 从旅行照片数据中提取照片并按城市分组
const photosByCity = computed(() => {
  const cityPhotos: Record<string, InterestImage[]> = {}

  travelImages.forEach((img) => {
    if (!cityPhotos[img.city]) {
      cityPhotos[img.city] = []
    }
    cityPhotos[img.city].push(img)
  })

  return cityPhotos
})

// 有照片的城市列表
const citiesWithPhotos = computed(() => {
  return Object.keys(photosByCity.value)
})

// 当前选中的城市
const selectedCity = ref<string | null>(null)

// 当前选中城市的照片
const selectedCityPhotos = computed(() => {
  if (!selectedCity.value)
    return []
  return photosByCity.value[selectedCity.value] || []
})

// 选择城市
function selectCity(city: string) {
  if (citiesWithPhotos.value.includes(city)) {
    selectedCity.value = selectedCity.value === city ? null : city
  }
}

// 关闭城市照片面板
function closeCityPanel() {
  selectedCity.value = null
}

// ECharts 相关
const chartRef = ref<HTMLElement | null>(null)
let chart: ECharts | null = null
let mapData: any = null
let regionsData: any[] = []

// 城市坐标数据 (名称 -> [经度, 纬度])
const cityCoordinates: Record<string, [number, number]> = {
  北京: [116.4, 39.9],
  上海: [121.5, 31.2],
  广州: [113.3, 23.1],
  深圳: [114.1, 22.5],
  成都: [104.1, 30.7],
  重庆: [106.5, 29.5],
  杭州: [120.2, 30.3],
  西安: [108.9, 34.3],
  武汉: [114.3, 30.6],
  南京: [118.8, 32.1],
  昆明: [102.7, 25.0],
  乌鲁木齐: [87.6, 43.8],
  哈尔滨: [126.6, 45.8],
  长春: [125.3, 43.9],
  沈阳: [123.4, 41.8],
  大连: [121.6, 38.9],
  青岛: [120.4, 36.1],
  厦门: [118.1, 24.5],
  福州: [119.3, 26.1],
  长沙: [112.9, 28.2],
  郑州: [113.6, 34.8],
  济南: [116.9, 36.7],
  天津: [117.2, 39.1],
  苏州: [120.6, 31.3],
  三亚: [109.5, 18.2],
  海口: [110.3, 20.0],
  丽江: [100.2, 26.9],
  桂林: [110.3, 25.3],
}

// 生成省份颜色
const provinceColorMap: Record<string, string> = {}
function getProvinceColor(provinceName: string): string {
  if (provinceColorMap[provinceName]) {
    return provinceColorMap[provinceName]
  }
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#6366f1',
    '#14b8a6',
    '#a855f7',
    '#eab308',
    '#22c55e',
    '#0ea5e9',
    '#d946ef',
    '#64748b',
    '#fb923c',
    '#4ade80',
    '#f43f5e',
    '#0d9488',
    '#7c3aed',
    '#ca8a04',
    '#16a34a',
    '#0284c7',
    '#db2777',
    '#94a3b8',
    '#fbbf24',
    '#86efac',
    '#fb7185',
    '#2dd4bf',
    '#c084fc',
    '#fef08a',
    '#86efac',
    '#fda4af',
    '#5eead4',
    '#a78bfa',
    '#fde047',
    '#4ade80',
    '#fda4af',
    '#99f6e4',
    '#e879f9',
    '#fef08a',
    '#bbf7d0',
    '#fecaca',
  ]
  let hash = 0
  for (let i = 0; i < provinceName.length; i++) {
    hash = provinceName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = colors[Math.abs(hash) % colors.length]
  provinceColorMap[provinceName] = color
  return color
}

// 准备散点图数据
const scatterData = computed(() => {
  return Object.entries(cityCoordinates)
    .filter(([city]) => citiesWithPhotos.value.includes(city))
    .map(([name, [lng, lat]]) => ({
      name,
      value: [lng, lat],
    }))
})

// 初始化 ECharts
function initChart() {
  if (!chartRef.value || !mapData)
    return

  chart = echarts.init(chartRef.value)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
    geo: {
      map: 'china',
      roam: false,
      itemStyle: {
        areaColor: '#c0c0c0',
        borderColor: '#4a90d9',
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#a0a0a0',
        },
      },
      label: {
        show: false,
      },
      regions: regionsData,
    },
    series: [
      {
        name: '有照片的城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData.value,
        symbol: 'circle',
        symbolSize: (val: any, params: any) => {
          return params.name === selectedCity.value ? 18 : 12
        },
        itemStyle: {
          color: (params: any) => {
            return params.name === selectedCity.value ? '#ff4500' : '#ffd700'
          },
          shadowBlur: 10,
          shadowColor: '#ffd700',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{b}',
          fontSize: 12,
          color: '#333',
        },
      },
    ],
  }

  chart.setOption(option)

  // 点击事件
  chart.on('click', (params: any) => {
    if (params.seriesType === 'scatter') {
      selectCity(params.name)
    }
  })
}

// 更新图表高亮
watch(selectedCity, () => {
  if (!chart)
    return

  chart.setOption({
    series: [
      {
        name: '有照片的城市',
        symbolSize: (val: any, params: any) => {
          return params.name === selectedCity.value ? 18 : 12
        },
        itemStyle: {
          color: (params: any) => {
            return params.name === selectedCity.value ? '#ff4500' : '#ffd700'
          },
        },
      },
    ],
  })
})

// 窗口大小调整
function handleResize() {
  chart?.resize()
}

// 过滤掉非中国大陆省份（台湾、香港、澳门）以及南海群岛
function filterMainlandChina(data: any): any {
  const excludeCodes = ['710000', '810000', '820000']
  if (data.features) {
    data.features = data.features.filter((feature: any) => {
      // 排除台湾、香港、澳门
      if (excludeCodes.includes(feature.id))
        return false
      // 排除南海群岛（通过 centroid 纬度判断，约 3-20°N 之间且在东经 109-118° 范围内）
      const centroid = feature.properties?.centroid || []
      const lng = centroid[0]
      const lat = centroid[1]
      if (lng >= 109 && lng <= 118 && lat >= 3 && lat <= 20) {
        // 这是南海群岛区域，排除
        return false
      }
      return true
    })
  }
  return data
}

// 构建省份颜色 regions
function buildRegions(data: any): any[] {
  const regions: any[] = []
  if (data.features) {
    data.features.forEach((feature: any) => {
      const name = feature.properties?.name || ''
      if (name) {
        regions.push({
          name,
          itemStyle: {
            areaColor: getProvinceColor(name),
          },
        })
      }
    })
  }
  return regions
}

// 生命周期
onMounted(() => {
  // 注册中国地图（仅中国大陆）
  loadMapData()
  window.addEventListener('resize', handleResize)
})

async function loadMapData() {
  try {
    // 使用本地地图数据
    const response = await fetch('/geojson/china.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    mapData = filterMainlandChina(data)
    regionsData = buildRegions(mapData)
    echarts.registerMap('china', mapData)
    initChart()
  }
  catch (err) {
    console.error('Failed to load China map:', err)
  }
}

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="china-map-wrapper">
    <div class="description">
      <h1>地图相册</h1>
      <p>
        点击地图上的城市查看相关照片
      </p>
    </div>
    <div class="china-map-album">
      <!-- 地图容器 -->
      <div ref="chartRef" class="map-container" />
    </div>

    <!-- 城市照片面板 -->
    <Transition name="slide">
      <div v-if="selectedCity" class="city-panel">
        <div class="city-panel-header">
          <h3>{{ selectedCity }}</h3>
          <button class="close-btn" @click="closeCityPanel">
            ×
          </button>
        </div>
        <div class="city-panel-content">
          <div class="city-panel-content-wrapper">
            <div
              v-for="photo in selectedCityPhotos"
              :key="photo.filename"
              class="photo-item"
            >
              <img :src="photo.url" :alt="photo.spot">
              <div class="photo-info">
                <span class="photo-spot">{{ photo.spot || photo.city }}</span>
                <span class="photo-date">{{ photo.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.china-map-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.china-map-album {
  width: 100%;
  max-width: 1400px;
  height: 800px;
  min-height: 600px;
  background: transparent;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* 城市照片面板 */
.city-panel {
  position: fixed;
  right: -60%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: 800px;
  background: var(--c-bg-soft, rgba(255, 255, 255, 0.98));
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 100;
}

.dark .city-panel {
  background: var(--c-bg-soft, #2d3748);
}

.city-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--c-border, #e5e5e5);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.city-panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.city-panel-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  scrollbar-width: none;
}

.city-panel-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.city-panel-content::-webkit-scrollbar {
  display: none;
}

.photo-item {
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--c-bg, #f9f9f9);
  flex-shrink: 0;
}

.dark .photo-item {
  background: #1a202c;
}

.photo-item img {
  margin-bottom: 0;
  margin-top: 0;
  width: 100%;
  height: 200px;
  min-height: 160px;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem;
}

.photo-info {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.photo-spot {
  font-weight: 500;
  color: var(--c-text, #333);
}

.dark .photo-spot {
  color: #e2e8f0;
}

.photo-date {
  color: var(--c-text, #666);
  opacity: 0.7;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-50%) translateX(100%);
  opacity: 0;
}

.description h1 {
  margin-bottom: 0.2rem;
}

.description p {
  font-size: 1rem;
  color: var(--c-text, #555);
  margin: 0;
}
</style>

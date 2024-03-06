<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    default: '行情'
  },
  chartId: {
    type: String,
    default: 'chart-' + Math.random().toString(36).substring(2)
  }
})

onMounted(() => {
  let base = +new Date(1968, 9, 3)
  let oneDay = 24 * 3600 * 1000
  let date = []
  let data = [Math.random() * 300]
  for (let i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay))
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
  }
  const chart = echarts.init(document.getElementById(props.chartId) as HTMLDivElement, null, { renderer: 'svg' })
  chart.setOption({
    grid: {
      top: '12px',
      left: '12px',
      right: '12px',
      bottom: '12px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitNumber: 1,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      splitNumber: 1,
      axisLabel: {
        inside: true,
        margin: 0,
        verticalAlign: 'bottom',
        verticalAlignMaxLabel: 'top'
      }
    },
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(65, 131, 231)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: -1,
              color: 'rgb(65, 131, 231)'
            },
            {
              offset: 0,
              color: 'rgb(255, 255, 255)'
            },
            {
              offset: 1,
              color: 'rgb(65, 131, 231)'
            }
          ])
        },
        data: data
      }
    ]
  })
})
</script>

<template>
  <CardBox>
    <div class="header h-4 flex justify-between items-center">
      <span class="title">{{props.title }}</span>
    </div>

    <div class="content">
      <div :id="props.chartId" class="h-60"></div>
    </div>
  </CardBox>
</template>
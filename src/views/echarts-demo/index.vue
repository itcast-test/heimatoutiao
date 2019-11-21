<template>
  <div>
    <h1>echarts 示例</h1>
    <h2>官方的 Hello World 示例</h2>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="main" style="width: 600px; height:400px;"></div>

    <h2>饼图示例</h2>
    <div ref="main2" style="width: 800px; height: 500px;"></div>
  </div>
</template>

<script>
// 1. npm install echarts
import echarts from 'echarts'

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
    // console.log(this.$refs.main)
  },
  // 如果需要在初始化的时候获取操作 DOM，一定要写在 mounted
  mounted () {
    // this.loadDemo1()

    // 请求加载动态数据初始化图表
    // this.loadDemo1WithApiData()

    // 先画好轮廓，然后再等待数据更新
    this.loadDemo2()
  },
  methods: {
    loadDemo1 () {
      // 1、基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main)

      // 2、指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例 hello'
        },
        tooltip: {},
        legend: {
          data: ['销量123']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量123',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }

      // 3、使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },

    loadDemo2 () {
      // 1、创建 echarts 实例
      const myChart = echarts.init(this.$refs.main2)

      // 2、配置数据
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: [
            '直达',
            '营销广告',
            '搜索引擎',
            '邮件营销',
            '联盟广告',
            '视频广告',
            '百度',
            '谷歌',
            '必应',
            '其他'
          ]
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '直达', selected: true },
              { value: 679, name: '营销广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: 335, name: '直达' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]
          }
        ]
      }

      // 3、将数据更新到图形上
      myChart.setOption(option)
    },

    loadDemo1WithApiData () {
      // 1、基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main)

      // 2、请求获取数据
      this.$axios({
        method: 'GET',
        url: 'http://localhost:3000/demo1'
      }).then(res => {
        // console.log(res.data)
        // 3、更新数据
        myChart.setOption(res.data)
      })
    }
  }
}
</script>

<style scoped></style>

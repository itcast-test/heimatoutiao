<template>
  <div class="channel-select">

    <!--
      element 的下拉列表组件
      它这个组件要求 v-model 绑定数据

      v-model="value"
        :value="value"
        @input="value = 事件参数"

      :value="value"
        前者是组件的属性名
        后者是 props 数据

      element 的 select 组件的切换选项的时候会触发一个名字叫 input 的自定义事件
      该事件可以获得一个回调参数：选中的 option 的 value

      所以我们就手动监听这个事件，事件触发的时候，使用 $emit 给父组件发出一个通知，让组件修改绑定的数据 channel_id
    -->
    <!-- <el-select
      placeholder="请选择频道"
      :value="value"
      @input="$emit('input', $event)"
    > -->
    <el-select
      placeholder="请选择频道"
      :value="value"
      @input="onInput"
    >
      <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="channel in channels"
        :key="channel.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ChannelSelect',
  components: {},
  props: {
    value: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      channels: [] // 存储频道列表
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      // 有些接口需要 token，有些接口不需要 token
      // 是否需要，应该由接口文档指示
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    },

    onInput (data) { // data 是选中的 option 的 value
      // 发布一个自定义事件，由于父组件使用的 v-model 简写，所以这里的事件名称必须叫 input
      this.$emit('input', data)
    }
  }
}
</script>

<style scoped></style>

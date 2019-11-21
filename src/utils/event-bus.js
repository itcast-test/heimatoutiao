import Vue from 'vue'

// 该模块导出一个新建的空的 Vue 实例
export default new Vue()

// 如何使用
// Vue 实例有两个用于通信的方法
// 发布订阅
// 在通信的 a 端（组件）使用 event-bus 订阅一个自定义事件
//    eventBus.$on('事件名称', () => {
//      // 自定义逻辑代码
//    })
// 在通信的 b 端（组件），根据你的业务发布调用自定义事件
//    eventBus.$emit('事件名称', 如果有数据可以往这里放)

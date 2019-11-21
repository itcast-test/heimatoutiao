<template>
  <!-- 头部组件 el-row布局 -->
  <el-row type='flex' justify="space-between" align="middle">
    <!-- 左侧 -->
    <el-col :span="6" class='left'>
      <!-- 左侧 -->
      <i class='el-icon-s-fold'></i>
      <span>江苏传智播客教育科技股份有限公司</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="3" class='right'>
      <!-- 头像 -->
      <img width="50" :src="user.photo" alt="">
      <!-- 下拉菜单 -->
      <el-dropdown trigger="click">
        <span>{{ user.name }}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户信息</el-dropdown-item>
          <el-dropdown-item>git地址</el-dropdown-item>
          <!--
            如果想要给一个组件注册一个原生 JavaScript 事件
            使用 .native 修饰符
           -->
          <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import eventBus from '@/utils/event-bus'

export default {
  data () {
    return {
      user: {
        name: '', // 用户昵称
        photo: '' // 用户头像
      }
    }
  },

  created () {
    this.loadUser()

    // 在初始化中监听自定义事件
    eventBus.$on('update-user', user => {
      // this.user = user
      this.user.name = user.name
      this.user.photo = user.photo
    })
  },

  methods: {
    loadUser () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        this.user = res.data.data
      }).catch(err => {
        console.log(err)
        this.$message.error('获取数据失败')
      })
    },
    onLogout () {
      this.$confirm('确认推出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        // 删除 token
        window.localStorage.removeItem('user-token')

        // 跳转到登录页
        this.$router.push('/login')

        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        // 取消执行这里
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}

</script>
<style lang='less' scoped>
.left {
  display: flex;
  align-items: center;

  i {
    font-size: 24px;
  }

  span {
    margin-left: 4px;
  }
}

.right {
  display: flex;
  align-items: center;

  img {
    border-radius: 50%;
    margin-right: 5px;
  }
}

</style>

<template>
  <div>
    <el-row>
      <el-col :span="10">
        <el-form ref="form" :model="user" label-width="80px">
          <el-form-item label="用户昵称">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="个人介绍">
            <el-input type="textarea" v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input disabled v-model="user.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="1" :span="5">
        <!--
          上传文件：
            使用 upload 自带的
            自己定义上传

          element 自带的 upload 组件默认发送的是 POST 请求
          而我们的接口要的是 PATCH 请求
          它不支持自定义请求方法

          http-request 覆盖默认的上传行为，可以自定义上传的实现
         -->
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :http-request="onUpload">
          <img v-if="user.photo" width="100" :src="user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <p>点击选择上传用户头像</p>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import eventBus from '@/utils/event-bus'

export default {
  name: 'AccountIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '', // 邮箱
        intro: '', // 简介
        mobile: '', // 手机号
        name: '', // 昵称
        photo: '' // 头像
      }
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    onSubmit () {
      // const name = this.user.name
      // const email = this.user.email
      // const intro = this.user.intro

      // 对象解构：等价于上面的三句代码
      const { name, email, intro } = this.user

      this.$axios({
        method: 'PATCH',
        url: '/user/profile',
        data: {
          // name: this.user.name,
          // email: this.user.email,
          // intro: this.user.intro
          name,
          email,
          intro
        }
      }).then(res => {
        // 更新用户信息成功以后，通知头部组件
        eventBus.$emit('update-user', this.user)

        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败')
      })
    },

    loadUserProfile () {
      this.$axios({
        method: 'GET',
        url: '/user/profile'
      }).then(res => {
        // res.date undefined
        // undefined.data 报错了
        this.user = res.data.data
      }).catch(err => {
        console.log(err)
        this.$message.error('获取数据失败')
      })
    },

    // 该事件触发的时候，它会给这个函数传递几个参数
    // 这里经过测试，我们发现在回调函数中会接收到一个参数：一个上传相关的配置对象
    // action: "https://jsonplaceholder.typicode.com/posts/"
    // data: undefined
    // file: 文件对象
    // filename: "file"
    // headers: {__ob__: Observer}
    // onError: ƒ onError(err)
    // onProgress: ƒ onProgress(e)
    // onSuccess: ƒ onSuccess(res)
    // withCredentials: false
    onUpload (config) {
      const fd = new FormData()
      fd.append('photo', config.file)
      this.$axios({
        method: 'PATCH',
        url: '/user/photo',
        data: fd
      }).then(res => {
        // 更新图片地址
        this.user.photo = res.data.data.photo

        // 发布通知头部组件更新用户信息
        eventBus.$emit('update-user', this.user)
      }).catch(err => {
        console.log(err)
        this.$message.error('上传失败')
      })
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

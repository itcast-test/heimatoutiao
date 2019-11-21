<template>
  <div class="upload-image">
    <div class="preview" @click="onUploadShow">
      <!-- <img src="" class="avatar"> -->
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </div>
    <!--
      visible 控制对话框的显示和隐藏
     -->
    <el-dialog
      title="请选择文章封面图片"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
    >
      <!-- 标签导航 -->
      <!--
        el-tabs 组件
          v-model 双向绑定
            数据驱动视图：当绑定数据发生改变，激活的标签页受影响
            视图影响数据：当标签改变的时候，标签的 name 会同步到数据中
          label 标签的标题
          name 相当于标签的 id
       -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="素材库" name="first">
          <!-- 标签内容写到里面来 -->
          <!--
            radio 有个 change 事件
            当选择的 radio 改变的时候会触发
           -->
          <el-radio-group v-model="activeImage" @change="loadImages">
            <el-radio label="all">全部</el-radio>
            <el-radio label="collect">收藏</el-radio>
          </el-radio-group>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in images" :key="item.id">
              <img height="100" :src="item.url">
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">配置管理</el-tab-pane>
      </el-tabs>
      <!-- /标签导航 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  components: {},
  props: {},
  data () {
    return {
      centerDialogVisible: false, // 对话框的显示状态
      activeName: 'first', // 激活的标签页
      activeImage: 'all', // 激活的图片筛选类型
      images: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
    console.log(123)
  },
  methods: {
    onUploadShow () {
      // 请求加载数据
      this.loadImages()

      // 显示弹窗
      this.centerDialogVisible = true
    },

    loadImages () {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          // this.activeImage 双向绑定了 radio 选择框组
          // 所以获取 this.activeImage 也就是在获取选中的那个 radio 的状态
          collect: this.activeImage === 'collect' // 是否获取收藏图片
        }
      }).then(res => {
        this.images = res.data.data.results
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.upload-image {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.upload-image .el-upload:hover {
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

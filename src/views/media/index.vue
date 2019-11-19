<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
        <el-button style="float: right; padding: 3px 0" type="text"
          >上传图片</el-button
        >
      </div>
      <!--
        el-row 行
          gutter 间隔距离
        el-col 列
          span 用来指定列数
       -->
      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="4"
          v-for="item in images"
          :key="item.id"
          class="col-item"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img
              :src="item.url"
              class="image"
              height="200"
            />
            <div style="padding: 14px;" class="action">
              <!-- class 还支持对象语法， -->
              <i :class="{
                'el-icon-star-on': item.is_collected,
                'el-icon-star-off': !item.is_collected
              }"></i>

              <!-- class 本来就是绑定数据字符串 -->
              <!-- <i :class="item.is_collected ? 'el-icon-star-on': 'el-icon-star-off'"></i> -->
              <i class="el-icon-delete-solid"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MediaIndex',
  components: {},
  props: {},
  data () {
    return {
      images: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  methods: {
    loadImages () {
      this.$axios({
        method: 'GET',
        url: '/user/images',
        params: {
          collect: false // 是否获取收藏图片
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

<style lang="less" scoped>
.grid-content {
  background-color: pink;
}

.col-item {
  margin-bottom: 20px;
  .action {
    display: flex;
    justify-content: center;
    font-size: 24px;
  }
}
</style>

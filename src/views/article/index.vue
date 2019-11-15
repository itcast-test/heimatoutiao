<template>
  <div class="article">
    <!-- 筛选数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterForm.status">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <el-select placeholder="请选择活动区域" v-model="filterForm.channel_id">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /筛选数据 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到59806条符合条件的内容</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="封面"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="address"
          label="发布日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      // 过滤数据的表单
      filterForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      rangeDate: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },

  created () {
    // 在我们的项目中，除了 /login 接口不需要 token，其它所有的接口都需要提供 token 才能请求
    // 否则后端返回 401 错误
    // 我们这里的后端要求把 token 放到请求头中
    const token = window.localStorage.getItem('user-token')

    this.$axios({
      method: 'GET',
      url: '/articles',
      headers: { // 添加请求头
        // 名字: 值
        // 后端要求把 token 放到请求头中，使用一个名字叫：Authorization
        // 注意，token的格式要求：Bearer 用户token
        // 注意！！！Bearer有个空格，多了少了都不行
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err, '获取数据失败')
    })
  }
}
</script>

<style scoped>
</style>

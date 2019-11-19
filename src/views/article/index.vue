<template>
  <div class="article">
    <!-- 筛选数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="文章状态">
          <!--
            单选框组会把选中的 radio 的 label 同步给绑定的数据
           -->
          <el-radio-group v-model="filterForm.status">
            <!-- 接口要求，不传为全部 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
            <el-radio label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <!--
            下拉列表会把选中的 option 的 value 同步到数据中
           -->
          <!-- <el-select placeholder="请选择频道" v-model="filterForm.channel_id">
            <el-option label="所有频道" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channels"
              :key="channel.id"
            ></el-option>
          </el-select> -->
          <channel-select v-model="filterForm.channel_id"></channel-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- 点击查询按钮：重新发请求获取筛选数据，新查询的数据肯定从第 1 页开始 -->
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /筛选数据 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ totalCount }}条符合条件的内容</span>
      </div>
      <!--
        el-table 表格组件
        data 表格的数组，要求是数组
        表格组件会使用 data 数据，在内部自己进行遍历，我们不需要自己写什么 v-for
        你只需要告诉这个表格组件：
          data 是啥
          表头名是什么
          列值是什么
        el-table-column 表格列组件
          prop 用来指定渲染哪个数据字段
          label 表头名称
          width 列宽

        表格列默认只能渲染普通文本，如果想要渲染点儿别的东西，需要自定义表格列。
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="date"
          label="封面"
          width="180">
          <!--
            自定义表格列
            在 template 上声明 slot-scope="scope" ，然后就可以通过 scope.row 获取遍历项
            scope.row 就相当于我们自己 v-for 的 item

            注意：只有当你需要在自定义表格列模板中访问遍历项的时候才这么做
           -->
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <!--
              0 草稿
              1 待审核
              2 审核通过
              3 审核失败
              4 已删除
             -->
            <!-- <span v-show="scope.row.status === 0">草稿</span>
            <span v-show="scope.row.status === 1">待审核</span>
            <span v-show="scope.row.status === 2">审核通过</span>
            <span v-show="scope.row.status === 3">审核失败</span>
            <span v-show="scope.row.status === 4">已删除</span> -->

            <!--
              scope.row.status
                0、1、2、3、4
              articleStatus
                [{ value: '草稿' }, { label: '待审核' }...]
             -->
            <!-- <span>{{ articleStatus[scope.row.status].label }}</span> -->

            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{ articleStatus[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="onDelete(scope.row.id)">删除</el-button>
            <el-button
              type="primary"
              @click="$router.push('/publish/' + scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /文章列表 -->

    <!-- 分页 -->
    <!--
      分页组件：
      它默认按照 10 条每页划分页码
      total 用来指定一共有多少条数据
      background 背景色
      layout 用来控制布局
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="onPageChange"
      :disabled="loading"
      :current-page="page">
    </el-pagination>
    <!-- /分页 -->
  </div>
</template>

<script>
import ChannelSelect from '@/components/channel-select'

export default {
  // 建议给每个组件都起一个名字，有一些好处，例如我们可以在调试工具中根据名字搜索组件
  name: 'ArticleIndex',
  components: {
    ChannelSelect
  },
  data () {
    return {
      // 过滤数据的表单
      filterForm: {
        status: null,
        channel_id: null
        // begin_pubdate: '',
        // end_pubdate: ''
      },
      rangeDate: [], // 日期范围（开始时间，结束时间）
      articles: [], // 文章数据列表
      articleStatus: [
        {
          type: '',
          label: '草稿'
        },
        {
          type: 'warning',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'danger',
          label: '审核失败'
        },
        {
          type: 'info',
          label: '已删除'
        }
      ],
      totalCount: 0, // 总记录数
      loading: true, // 表格的 loading 状态
      // channels: [], // 频道列表
      page: 1 // 当前页码
    }
  },

  created () {
    // console.log('article created')
    // 初始化的时候加载第 1 页数据
    this.loadArticles(1)

    // 加载频道列表
    // this.loadChannels()
  },

  methods: {
    // 如果 page 就使用传递的，如果没传，默认就是 1
    loadArticles (page = 1) {
      // 加载 loading
      this.loading = true

      // 在我们的项目中，除了 /login 接口不需要 token，其它所有的接口都需要提供 token 才能请求
      // 否则后端返回 401 错误
      // 我们这里的后端要求把 token 放到请求头中
      // const token = window.localStorage.getItem('user-token')

      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: { // 添加请求头
        //   // 名字: 值
        //   // 后端要求把 token 放到请求头中，使用一个名字叫：Authorization
        //   // 注意，token的格式要求：Bearer 用户token
        //   // 注意！！！Bearer有个空格，多了少了都不行
        //   Authorization: `Bearer ${token}`
        // },
        // Query 参数使用 params 传递
        params: {
          page, // 页码
          per_page: 10, // 每页大小，后端按照默认 10 条每页
          // axios 有个功能，当参数值为 null、undefined 的时候，它就不发送了
          // status: null // 文章状态
          status: this.filterForm.status, // 文章状态
          channel_id: this.filterForm.channel_id, // 频道id，不传就是所有
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始时间
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 结束时间
        }
      }).then(res => { // 成功执行这里
        // 更新文章列表数组
        this.articles = res.data.data.results
        // 更新总记录数
        this.totalCount = res.data.data.total_count
      }).catch(err => { // 失败执行这里
        console.log(err, '获取数据失败')
      }).finally(() => { // 无论成功还是失败，最终都要执行
        // 停止 loading
        this.loading = false
      })
    },

    // 该函数是分页组件的 current-change 事件处理函数
    // 该函数也不是我们调用的，我们只是写了里面的业务代码
    // current-change 事件：当页码改变的时候，分页组件会调用这个方法
    // 分页组件在调用的时候，会把当前页码传递给这个方法
    // 我们这里要做的就是声明一个参数接收使用即可
    onPageChange (page) {
      // 记录当前最新页码
      this.page = page
      // 请求加载指定页码的文章列表
      this.loadArticles(page)
    },

    // loadChannels () {
    //   // 有些接口需要 token，有些接口不需要 token
    //   // 是否需要，应该由接口文档指示
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   }).then(res => {
    //     this.channels = res.data.data.channels
    //   }).catch(err => {
    //     console.log(err, '获取数据失败')
    //   })
    // },

    onDelete (articleId) {
      // 这里报 400 错，是因为数据 id 的问题
      // 这个数据 id 不对
      this.$axios({
        method: 'DELETE',
        // /mp/v1_0/articles/:target
        // 注意：接口路径中的 :target 是一个路径参数，:target 是动态的，例如1、2、3，不要写 :
        url: `/articles/${articleId}` // 任何数据和字符串相加都会自动 toString
        // headers: {
        //   // 接口中说明的 Content-Type application/json 不需要传递
        //   // 因为 axios 会自动添加发送 Content-Type application/json
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // }
      }).then(res => {
        // 删除成功，重新加载当前页码文章列表
        this.loadArticles(this.page)
      }).catch(err => {
        console.log(err, '删除失败')
      })
    },

    onQuery () {
      // 加载查询第1页数据
      this.loadArticles(1)

      // 更新分页组件让第1页激活高亮
      this.page = 1
    }
  }
}
</script>

<style scoped lang="less">
.article {
  .box-card {
    margin-bottom: 20px;
  }
}
</style>

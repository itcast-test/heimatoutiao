<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论详情列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>

      <el-table
        :data="comments"
        style="width: 100%">
        <el-table-column
          label="头像"
          width="180">
          <template slot-scope="scope">
            <img width="50" :src="scope.row.aut_photo">
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="点赞"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.is_liking === 1 ? '已赞' : '没有赞' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="like_count"
          label="点赞数量"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="评论日期"
          width="180">
          <template slot-scope="scope">
            <!--
              不传参：{{ scope.row.pubdate | dateFormat }}
              传参：{{ scope.row.pubdate | dateFormat(参数) }}
             -->
            {{ scope.row.pubdate | dateFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否推荐"
          width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_top"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onTop(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="reply_count"
          label="回复数量"
          width="180">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// import moment from 'moment'

export default {
  name: 'CommentDetail',
  components: {},
  // 除了可以通过 this.$route.params 获取路由参数
  // 还有一种更方便的方式：通过 props 解耦，说白了就是自动把路由参数映射到 props 中
  // 然后就可以像访问 data 数据一样来访问路由参数了
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      comments: []
    }
  },
  computed: {},
  watch: {
  },
  // 实例选项：过滤器
  //  全局：任何组件都可以
  //  局部：只能用在当前组件使用
  // 它的作用就是：常用语一些简单的文本格式化，例如日期格式化处理
  // 过滤器函数可以直接在模板中调用
  // 调用方式：{{ 数据 | 过滤器函数 }}
  // filters: {
  //   dateFormat (value) {
  //     console.log('dateFormat 被调用了')
  //     return moment(value).format('YYYY-MM-DD')
  //   }
  // },

  created () {
    this.loadComments()
  },
  methods: {
    loadComments () {
      this.$axios({
        method: 'GET',
        url: '/comments',
        params: {
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.articleId // 文章id 或 评论id
        }
      }).then(res => {
        const comments = res.data.data.results

        // comments.forEach(item => {
        //   // moment(指定时间).format('格式')
        //   item.pubdate = moment(item.pubdate).format('YYYY-MM-DD')
        // })

        // 将处理之后的数据更新到组件中
        this.comments = comments
      }).catch(err => {
        console.log(err)
        this.$message.error('获取数据失败')
      })
    },

    onTop (comment) {
      this.$axios({
        method: 'PUT',
        url: `/comments/${comment.com_id}/sticky`,
        data: {
          // comment.is_top 双向绑定给了开关按钮
          // 所以获取 comment.is_top 就是在获取开关的状态
          sticky: comment.is_top
        }
      }).then(res => {
        this.$message('操作成功')
      }).catch(err => {
        this.$message.error('操作失败', err)
      })
    }
  }
}
</script>

<style scoped></style>

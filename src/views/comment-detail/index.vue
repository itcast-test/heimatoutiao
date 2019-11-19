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
        this.comments = res.data.data.results
      }).catch(err => {
        console.log(err)
        this.$message.error('获取数据失败')
      })
    }
  }
}
</script>

<style scoped></style>

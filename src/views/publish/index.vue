<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $route.params.articleId ? '编辑文章' : '发布文章' }}</span>
      </div>
      <el-form ref="form" :model="article" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <!-- bidirectional data binding（双向数据绑定） -->

          <!-- 富文本编辑器 -->
          <quill-editor v-model="article.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="频道">
          <!-- <el-select placeholder="请选择频道" v-model="article.channel_id">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channels"
              :key="channel.id"
            ></el-option>
          </el-select> -->

          <!--
            人家这个组件 v-model 的功能和普通的 select 下拉框的功能是一样的
            首先：
              下拉列表的选中状态受数据影响
              下拉列表改变，也会改变数据
           -->
          <!-- <el-select placeholder="请选择频道" v-model="abc">
            <el-option label="北京" value="0"></el-option>
            <el-option label="上海" value="1"></el-option>
            <el-option label="广州" value="2"></el-option>
          </el-select> -->

          <!--
            我们自己封装的频道下拉列表
            下拉列表的选中状态受绑定数据的影响
            下拉列表切换选中也会改变绑定的数据

            一个组件上只能有一个 v-model 数据绑定

            v-model 是两个语法的简写：
              :value="article.channel_id"
              @input="article.channel_id = 事件参数"
          -->
          <channel-select
            v-model="article.channel_id"
            :include-all="false"
          ></channel-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type >= 0">
            <UploadImage
              v-for="item in article.cover.type"
              :key="item"
            ></UploadImage>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">发表</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 加载富文本编辑器的样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 加载富文本编辑器的核心组件
import { quillEditor } from 'vue-quill-editor'

// 1. 加载
import ChannelSelect from '@/components/channel-select'
// 2. 注册
// 3. 使用

import UploadImage from './components/upload-image'

export default {
  name: 'PublishArticle',
  components: {
    // 注册局部组件
    quillEditor,
    // 使用的时候，可以：
    //  <ChannelSelect></ChannelSelect>
    //  也可以：<channel-select></channel-select>
    // 在使用的时候我个人更喜欢小写
    // 但是注册时候，更推荐大写
    ChannelSelect,
    UploadImage
    // 'channel-select': ChannelSelect
  },
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片，无图就是空数组即可
        },
        channel_id: 4
      },
      // channels: [],
      editorOption: {} // 富文本编辑器的配置选项对象
    }
  },

  created () {
    // console.log('publish created')
    // this.loadChannels()

    // 添加和编辑使用的都是这个组件
    // 只有编辑才需要在初始化的时候，根据id获取加载文章的内容
    if (this.$route.params.articleId) {
      this.loadArticle()
    }
  },

  methods: {
    loadArticle () {
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.articleId}`
      }).then(res => {
        this.article = res.data.data
      })
    },

    onSubmit (draft) {
      if (this.$route.params.articleId) {
        // 请求编辑文章
        this.updateArticle(draft)
      } else {
        // 请求添加文章
        this.addArticle(draft)
      }
    },

    addArticle (draft) {
      this.$axios({
        method: 'POST',
        url: '/articles',
        // Headers 参数
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // },
        // Query 参数
        params: {
          draft
        },
        // Body 参数
        data: this.article
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err, '保存失败')
      })
    },

    updateArticle (draft) {
      this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.articleId}`,
        params: {
          draft
        },
        data: this.article
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    }

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
    // }
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>

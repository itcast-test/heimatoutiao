<template>
  <div>
    <p @click="centerDialogVisible=true">图片上传组件</p>
    <!--
      visible 控制对话框的显示和隐藏
     -->
    <el-dialog
      title="请选择文章封面图片"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
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
      centerDialogVisible: false
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {}
}
</script>

<style scoped></style>

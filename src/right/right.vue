<template>
<div class="right">
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>

<template>
  <el-table
    :row-class-name="tableRowClassName"
    :data="rightData"
    border
    style="width: 100%">
    <el-table-column
    type="index"
      prop="xuhao"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径">
    </el-table-column>
    <el-table-column
      prop="level"
      label="层级">
      <template slot-scope="scope">
          {{scope.row.level | levelFormat}}
      </template>
    </el-table-column>
  </el-table>
</template>
</div>
</template>

<script>
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      // 所有的数据
      rightData: []
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        console.log(res)
        this.rightData = res.data.data
      })
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '3') {
        return '三级'
      }
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: skyblue;
  }
</style>

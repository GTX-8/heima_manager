<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin: 15px 0;">
      <el-input placeholder="请输入内容" class="input-with-select" style="width:300px;margin-right:10px">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>

    <template>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" width='50'></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
        <el-table-column label="用户状态" width="100">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip content="分配" placement="top">
            <el-button type="primary" icon="el-icon-check"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { getAllUserList } from '@/api/user_index.js'
export default {
  data () {
    return {
      value2: 'true',
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 表格数据源,它是一个数组,里面的每一个元素都是一个对象
      userList: []
    }
  },
  mounted () {
    getAllUserList(this.userObj)
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>

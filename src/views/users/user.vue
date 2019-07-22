<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin: 15px 0;">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        v-model="userObj.query"
        @keyup.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="adddialogFormVisible = true">添加用户</el-button>
    </div>

    <template>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
        <el-table-column label="用户状态" width="100">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配" placement="top">
              <el-button type="primary" icon="el-icon-check"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
               <el-button type="text" @click="del(scope.row.id)"><el-button type="primary" icon="el-icon-delete"></el-button></el-button>

            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userObj.pagenum"
      :page-sizes="[1,2,3,4]"
      :page-size="userObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户操作 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input auto-complete="off" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input auto-complete="off" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input auto-complete="off" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户编辑操作 -->
    <el-dialog title="添加用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules" :label-width="formLabelWidth">
        <el-form-item label="用户名:" prop="editname">
          <el-input v-model="editForm.editname" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input auto-complete="off" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input auto-complete="off" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUserList, addUserList, editUserList, deletUserList, updateUserState } from '@/api/user_index.js'
export default {
  data () {
    return {
      total: 0,
      value2: 'true',
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      formLabelWidth: '80px',
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        email: '',
        mobile: '',
        id: '',
        editname: ''
      },
      // 表格数据源,它是一个数组,里面的每一个元素都是一个对象
      userList: [],
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 修改用户状态
    async changeState (id, type) {
      let res = await updateUserState(id, type)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      }
    },
    // 删除用户操作
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 如果确定就执行then里面的操作
        deletUserList(id)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 代码到了这一步,说明记录已经删除,但是还没有刷新
              this.userObj.pagenum = Math.ceil((this.total - 1) / this.userObj.pagesize) ? --this.userObj.pagenum : this.userObj.pagenum
              this.init()
            }
          })
          .catch(err2 => {
            console.log(err2)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑提交
    async editsubmit () {
      let res = await editUserList(this.editForm)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        // 隐藏对话框
        this.editdialogFormVisible = false
        // 重置表单元素的数据
        this.$refs.editForm.resetFields()
        // 刷新
        this.init()
      } else {
        this.message({
          type: 'error',
          message: res.data.meta.msg
        })
      }
    },
    // 显示编辑对话框
    showEditDialog (row) {
      this.editdialogFormVisible = true
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
      this.editForm.editname = row.username
    },
    // 添加用户
    addsubmit () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUserList(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 成功添加之后隐藏对话框
                this.adddialogFormVisible = false
                // 重置表单元素的数据
                this.$refs.addForm.resetFields()
                // 刷新
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            type: 'error',
            message: '数据输入不合法'
          })
          return false
        }
      })
    },
    // 切换每页显示数量时触发
    handleSizeChange (val) {
      this.userObj.pagesize = val
      this.init()
    },
    // 切换当前页码时触发
    handleCurrentChange (val) {
      this.userObj.pagenum = val
      this.init()
    },
    init () {
      getAllUserList(this.userObj)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>

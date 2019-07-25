<template>
  <div class="role">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addroledialogFormVisible=true">添加角色</el-button>
    <template>
      <el-table :data="roleData" style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row>
                    <el-col :span="24" v-show="scope.row.children.length===0">很抱歉,此用户没有任何权限</el-col>
                </el-row>
                <el-row  v-for="first in scope.row.children" :key="first.id"  style="margin-bottom:10px;border-bottom:1px dashed #ccc">
                    <el-col :span="4" >
                        <el-tag closable :type="'success'" @close='delRightById(scope.row,first.id)'>{{first.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row  v-for="second in first.children" :key="second.id" style="margin-bottom:10px">
                            <el-col :span="4"><el-tag closable :type="'info'" @close='delRightById(scope.row,second.id)'>{{second.authName}}</el-tag></el-col>
                            <el-col :span="20"><el-tag closable :type="'warning'"  v-for="third in second.children" :key="third.id" style="margin: 0 5px" @close='delRightById(scope.row,third.id)'>{{third.authName}}</el-tag></el-col>
                        </el-row>
                    </el-col>
                </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip content="角色授权" placement="top">
              <el-button type="primary" icon="el-icon-check" @click="showRightList(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="text">
                <el-button type="primary" icon="el-icon-delete"></el-button>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 角色权限添加 -->
     <el-dialog title="角色权限" :visible.sync="roledialogFormVisible">
       <el-tree
      :data="rightList"
      ref='mytree'
      show-checkbox
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="checkedArr"
      :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='addRight'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="角色权限" :visible.sync="addroledialogFormVisible">
    <el-form ref="addForm" :model="addRoleForm" label-width="80px" :rules="rules">
  <el-form-item label="角色名称" prop='name'>
    <el-input v-model="addRoleForm.name"></el-input>
  </el-form-item>
    <el-form-item label="角色描述" prop='desc'>
    <el-input v-model="addRoleForm.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button>取消</el-button>
    <el-button type="primary" @click="addRole">确定</el-button>
  </el-form-item>
</el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAllRoleList, deleteRole, addRole } from '@/api/role_index.js'
import { getAllRightList, addRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      roledialogFormVisible: false,
      addroledialogFormVisible: false,
      roleData: [],
      rightList: [],
      checkedArr: [],
      addRoleForm: {
        name: '',
        desc: ''
      },
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 添加角色
    addRole () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addRole(this.addRoleForm.name, this.addRoleForm.desc)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '请输入正确的用户名或描述'
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '请输入完整的角色名或描述'
          })
        }
        this.addroledialogFormVisible = false
        this.init()
      })
    },
    // 添加角色权限
    async addRight () {
      let arr1 = this.$refs.mytree.getHalfCheckedKeys()
      let arr2 = this.$refs.mytree.getCheckedKeys()
      let arr = [...arr1, ...arr2]
      let rid = arr.join(',')
      let res = await addRightList(this.roleId, rid)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.meta.msg
        })
      }
      this.roledialogFormVisible = false
      this.init()
    },
    // 树形权限列表的展示
    async showRightList (row) {
      this.roleId = row.id
      this.roledialogFormVisible = true
      let res = await getAllRightList('tree')
      this.rightList = res.data.data
      // 默认展开权限展示
      this.checkedArr.length = 0
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkedArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 删除角色权限
    delRightById (row, rightId) {
      deleteRole(row.id, rightId)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            row.children = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 页面数据的展示
    init () {
      getAllRoleList('list')
        .then(res => {
          this.roleData = res.data.data
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

<style>
</style>

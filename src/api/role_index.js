// 这个文件用来处理所有与角色相关的操作
import axios from '@/utils/myaxios.js'
// 获取所有角色
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色权限
export const deleteRole = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 增加角色
export const addRole = (roleName, roleDesc) => {
  return axios({
    url: 'roles',
    method: 'post',
    data: { roleName, roleDesc }
  })
}

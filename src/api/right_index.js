// 这个文件用来处理所有与角色相关的操作
import axios from '@/utils/myaxios.js'

// 获取所有权限列表
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 角色授权
export const addRightList = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 左侧菜单权限
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}

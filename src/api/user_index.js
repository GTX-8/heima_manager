// 这个文件用来处理所有与用户相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 登录
export const login = (data) => {
  // axios({})反悔了一个promise对象
  return axios({
    // http://localhost:8888/api/private/v1/login
    // 设置请求路径
    url: 'login',
    method: 'post',
    // post方式所传递的数据
    data
  })
}

// 获取所有用户数据
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户接口
export const addUserList = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 编辑用户借口
export const editUserList = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: { email: data.email, mobile: data.mobile }
  })
}

// 删除用户接口
export const deletUserList = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 根据id修改用户状态
export const updateUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 分配用户角色
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

import {environment} from '../../environments/environment';

export const API = {
  login: `${environment.backend}api/login`,  // 登陆的API地址
  user_info: `${environment.backend}api/user/me/basic-info`,  // 个人信息的API地址
  change_password: `${environment.backend}api/user/me/password`,  // 修改密码的API地址
  upload_avatar: `${environment.backend}api/user/me/avatar`,  //  上传头像的API地址
  user: `${environment.backend}api/user`,  // 与用户有关的API地址
  delete_project: `${environment.backend}api/train-project`,  // 删除实训的API地址
  org: `${environment.backend}api/org`,  // 与组织有关的API地址
  org_basic_info: `${environment.backend}api/org/basic-info`, // 获取组织基本信息的API地址
  train: `${environment.backend}api/train`,  // 与实训有关的API地址
  enterprise_admin: `${environment.backend}api/user/enterprise-admin`,  // 与批量导入企业管理员有关的地址
}

export interface Resp {
  status: number;
  date: number | string;
  msg: string;
  data?: any;
}

export interface LoginQ {
  username: string;
  password: string;
}

export type Role =
  'ROLE_SYSTEM_ADMIN' |
  'ROLE_ENTERPRISE_ADMIN' |
  'ROLE_SCHOOL_ADMIN' |
  'ROLE_SCHOOL_TEACHER' |
  'ROLE_STUDENT_MEMBER';

export const RoleTable: {[key: string]: string} = {
  ROLE_SYSTEM_ADMIN: '系统管理员',
  ROLE_ENTERPRISE_ADMIN: '企业管理员',
  ROLE_SCHOOL_ADMIN: '组织管理员',
  ROLE_SCHOOL_TEACHER: '教师',
  ROLE_STUDENT_MEMBER: '学生'
}

export interface UserInfo {
  email: string;
  role_name: Role;
  // 系统内部数字表示
  user_id: number;
  // 用户真实姓名
  name: string;
  // 登录用ID
  username: string;
  avatar: string;

  phone_number?: string;
  gender?: boolean;
  introduction?: string;

  common_id?: string; // deprecated stuff
}

export interface UserInfoL {
  login: boolean;
  info?: UserInfo;
}

export interface RegisterQ {
  name: string;
  password: string;
  invitation_code: string;
}

export interface RegisterP {
  status_code: number;
  id?: string;
  user_info?: UserInfo;
}

export interface ChangePasswordQ {
  origin_password: string;
  new_password: string;
}

export interface ModifyUserInfoQ {
  id: string;
  new_user_info: UserInfo;
}

export interface  ModifyUserBasicInfoQ {
  name: string;
  gender: boolean;
  introduction: string;
}

export interface ModifyUserInfoP {
  status_code: number;
}

export interface Organization {
  id?: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  invitation_code?: string;
  created?: number | string;
}

export interface Train {
  id: number;
  name: string;
  organization: string;
  organization_id: number;
  start_time?: number | string;
  end_time?: number | string;
  // TODO should the following be pure text, or html content?
  // 实训内容?
  content?: string;
  // 验收标准
  standard?: string;
  // 实训资源 may need another json load process if type is string
  resource_lib?: string | TrainResource[];
  // TODO format? how to display & set it?
  // 位置信息
  gps_info?: string;
}

export interface TrainResource {
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created: string | number;
  original_name: string;
}

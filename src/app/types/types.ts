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
  'ROLE_STUDENT_MASTER' |
  'ROLE_STUDENT_PM' |
  'ROLE_STUDENT_PO' |
  'ROLE_STUDENT_MEMBER';

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

export interface ModifyUserInfoP {
  status_code: number;
}

export interface GetUserInfoQ {
  id: string;
}

export interface GetUserInfoP {
  status_code: number;
  user_info: UserInfo;
}



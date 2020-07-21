export interface Resp {
  status: number;
  date: number | string;
  msg: string;
  total_rows?: number;
  data?: any;
}

export interface PageResp {
  status: number;
  date: number | string;
  msg: string;
  total_rows: number;
  data?: any;
}

export interface PageInfoQ {
  page: number;
  offset: number;
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

export interface PostRegisterQ{
  common_id: string;
  name: string;
  password: string;
  email: string;
  organization_id: number;
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
  introduction?: string;
  phone_number?: number;
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

export interface CreateOrgQ{
  real_name: string;
  code: string;
  website_url: string;
  description: string;
}

export interface GetOrgQ{
  id?: number;
  gmt_create: string;
  name: string;
  real_name: string ;
  description: string;
  website_url: string;
}

export interface DeleteUserQ {
  selection: number[];
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
  resource_lib?: string | ResourceFile[];
  // TODO format? how to display & set it?
  // 位置信息
  gps_info?: string;
}

export interface TrainQ{
  id?: number;
  name: string;
  content: string;
  organization_id: number;
  org_name?: string;
  start_time: string;
  end_time: string;
  accept_standard: string;
  resource_library: string;
  gps_info: string;
}

export interface CreateTrainQ{
  name: string;
  content: string;
  organization_id: number;
  start_time: string;
  end_time: string;
  accept_standard: string;
  resource_library: string;
  gps_info: string;
}

export interface ResourceFile {
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created: string | number;
  original_name: string;
}

export interface ChangPwdByForce {
  username: string;
  new_password: string;
}

export interface Project {
  id: number;
  name: string;
  level: number;
  content: string;
  // like above
  resource_lib?: string | ResourceFile[];
}

export interface  ProjectQ {
  id: number;
  name: string;
  level: number;
  content: string;
  // like above
  resource_library?: string | ResourceFile[];
}

export interface GetTeamQ{
  id: number;
  name: string;
  avatar: string;
  evaluation: string;
  train_id: number;
  project_id: number;
  repo_url: string;
  team_grade: number;
}

export interface Team {
  id: number;
  name: string;
  avatar?: string;
  repo_url?: string;
  train_project_id: number;
  train_name: string;
  project_name: string;
  member_count?: number;
  leader_id: number;
  members?: UserInfo[];
  // like above
  resource_lib?: string | ResourceFile[];

  // 团队评分
  team_grade?: number;

  // 团队评价
  evaluation?: string;
}

export interface Message {
  // TODO how to represent system message? (current plan: nullable)
  sender?: UserInfo;
  title: string;
  message: string;
  action?: string;
  unread: boolean;
}
